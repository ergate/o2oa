(function (global) {
    "use strict";

    // 2026-10-01 00:00:00 Asia/Shanghai, expressed as an absolute instant.
    var GATE_VERSION = "2026093002";
    var STOP_AT = 1790784000000;
    var EXEMPT_PERSON = "系统运维@fx0001@P";
    var RETURN_PORTAL = "https://zsxx.nankai.edu.cn/";
    var NOTICE = "接南开大学终身教育管理办公室通知，本系统自2026年10月1日0时起，停止使用。如有疑问请与南开大学终身教育管理办公室联系。";
    var blocked = false;
    var monitorId = null;
    var clockOffset = 0;
    var clockReady = false;
    var clockLoading = false;
    var clockCallbacks = [];
    var serverClockBase = null;
    var monotonicClockBase = null;
    var clockSource = "browser";
    var serverTimeText = "";
    var clockError = "";

    function now() {
        if (serverClockBase !== null && monotonicClockBase !== null
                && global.performance && global.performance.now) {
            return serverClockBase + (global.performance.now() - monotonicClockBase);
        }
        return Date.now() + clockOffset;
    }

    function finishClockSync() {
        clockReady = true;
        clockLoading = false;
        while (clockCallbacks.length) {
            clockCallbacks.shift()();
        }
    }

    function parseShanghaiServerTime(value) {
        var match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(value || "");
        if (!match) {
            return NaN;
        }
        // The authentication echo API returns local Asia/Shanghai time without
        // an offset. Convert it explicitly instead of using the Date parser that
        // O2OA/MooTools replaces at runtime.
        return global.Date.UTC(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3]),
            Number(match[4]) - 8,
            Number(match[5]),
            Number(match[6])
        );
    }

    function parseHttpDate(value) {
        if (!value) {
            return NaN;
        }
        var parsed = new global.Date(value);
        return parsed && typeof parsed.getTime === "function" ? parsed.getTime() : NaN;
    }

    function setServerClock(serverDate, source, text) {
        if (isNaN(serverDate)) {
            return false;
        }
        serverClockBase = Number(serverDate);
        clockOffset = serverClockBase - global.Date.now();
        monotonicClockBase = global.performance && global.performance.now
            ? global.performance.now() : null;
        clockSource = source;
        serverTimeText = text || "";
        return true;
    }

    function syncServerClock(callback) {
        if (clockReady) {
            callback();
            return;
        }
        clockCallbacks.push(callback);
        if (clockLoading) {
            return;
        }
        clockLoading = true;
        if (!global.XMLHttpRequest) {
            finishClockSync();
            return;
        }
        try {
            var request = new global.XMLHttpRequest();
            var completed = false;
            var complete = function () {
                if (completed) {
                    return;
                }
                completed = true;
                finishClockSync();
            };
            request.open("GET", "/x_organization_assemble_authentication/jaxrs/echo?_systemStopClock="
                + global.Date.now(), true);
            request.timeout = 3000;
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    var synchronized = false;
                    try {
                        var response = JSON.parse(request.responseText || "{}");
                        var value = response && response.data && response.data.serverTime
                            ? response.data.serverTime : response.date;
                        synchronized = setServerClock(
                            parseShanghaiServerTime(value),
                            "authentication-echo",
                            value
                        );
                    } catch (parseError) {
                        clockError = "echo-response: " + (parseError.message || parseError);
                    }
                    if (!synchronized) {
                        var header = request.getResponseHeader("Date") || "";
                        synchronized = setServerClock(parseHttpDate(header), "http-date", header);
                    }
                    if (!synchronized && !clockError) {
                        clockError = "server-time-unavailable";
                    }
                    complete();
                }
            };
            request.onerror = function () {
                clockError = "clock-request-error";
                complete();
            };
            request.ontimeout = function () {
                clockError = "clock-request-timeout";
                complete();
            };
            request.send(null);
        } catch (ignoreClock) {
            clockError = "clock-exception: " + (ignoreClock.message || ignoreClock);
            finishClockSync();
        }
    }

    function currentUser() {
        if (!global.layout) {
            return null;
        }
        if (layout.session && layout.session.user) {
            return layout.session.user;
        }
        return layout.user || null;
    }

    function isAuthenticated(user) {
        return !!(user && user.name && user.name !== "anonymous");
    }

    function isExempt(user) {
        if (!user) {
            return false;
        }
        if (user.distinguishedName === EXEMPT_PERSON) {
            return true;
        }
        return user.name === "系统运维" && user.unique === "fx0001";
    }

    function hasMaintenanceLoginFlag() {
        return /(?:\?|&)systemStopLogin=1(?:&|$)/.test(global.location.search || "");
    }

    function clearLocalSession() {
        try {
            if (global.layout && layout.session && layout.session.user) {
                layout.session.user.token = "";
            }
        } catch (ignore) {
        }
        try {
            if (global.sessionStorage) {
                global.sessionStorage.removeItem("o2LayoutSessionToken");
            }
        } catch (ignoreStorage) {
        }
    }

    function logout() {
        var actions = null;
        try {
            if (global.o2 && o2.Actions) {
                actions = o2.Actions;
            } else if (global.MWF && MWF.Actions) {
                actions = MWF.Actions;
            }
            if (actions) {
                actions.get("x_organization_assemble_authentication").logout(
                    clearLocalSession,
                    clearLocalSession
                );
                return;
            }
        } catch (ignore) {
        }
        clearLocalSession();
    }

    function showNotice() {
        if (blocked) {
            return;
        }
        blocked = true;
        if (monitorId) {
            global.clearInterval(monitorId);
            monitorId = null;
        }
        try {
            global.stop();
        } catch (ignoreStop) {
        }

        var render = function () {
            if (!global.document.body) {
                global.setTimeout(render, 0);
                return;
            }
            global.document.title = "系统停用通知";
            global.document.body.innerHTML = ''
                + '<div role="alert" style="box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:32px;background:#f4f6f9;font-family:\'Microsoft YaHei\',Arial,sans-serif;color:#252b3a;">'
                + '  <div style="box-sizing:border-box;width:100%;max-width:760px;padding:48px 56px;border-top:5px solid #0f1851;border-radius:8px;background:#fff;box-shadow:0 12px 36px rgba(15,24,81,.14);text-align:center;">'
                + '    <div style="margin-bottom:22px;font-size:28px;font-weight:600;color:#0f1851;">系统停用通知</div>'
                + '    <div style="font-size:18px;line-height:2;text-align:left;">' + NOTICE + '</div>'
                + '    <button type="button" id="o2-system-stop-close" style="margin-top:28px;padding:10px 30px;border:0;border-radius:4px;background:#0f1851;color:#fff;font-size:14px;cursor:pointer;">关闭</button>'
                + '  </div>'
                + '</div>';
            var closeButton = global.document.getElementById("o2-system-stop-close");
            if (closeButton) {
                closeButton.onclick = function () {
                    clearLocalSession();
                    global.location.replace(RETURN_PORTAL);
                };
            }
        };
        render();
        logout();
    }

    function startMonitor(options) {
        if (monitorId) {
            return;
        }
        monitorId = global.setInterval(function () {
            if (now() < STOP_AT || blocked) {
                return;
            }
            var user = currentUser();
            if (isExempt(user)) {
                return;
            }
            if (options.allowAnonymousLogin && !isAuthenticated(user)) {
                return;
            }
            if (options.allowMaintenanceLogin && hasMaintenanceLoginFlag() && !isAuthenticated(user)) {
                return;
            }
            showNotice();
        }, 500);
    }

    function decide(options, user, allowed) {
        startMonitor(options);
        if (now() < STOP_AT || isExempt(user)) {
            allowed();
            return;
        }
        if (options.allowAnonymousLogin && !isAuthenticated(user)) {
            allowed();
            return;
        }
        if (options.allowMaintenanceLogin && hasMaintenanceLoginFlag() && !isAuthenticated(user)) {
            allowed();
            return;
        }
        showNotice();
    }

    function authorize(options, allowed) {
        options = options || {};
        if (!clockReady) {
            syncServerClock(function () {
                authorize(options, allowed);
            });
            return;
        }
        var user = currentUser();
        if (user) {
            decide(options, user, allowed);
            return;
        }
        if (global.layout && layout.sessionPromise && layout.sessionPromise.then) {
            layout.sessionPromise.then(function (sessionUser) {
                decide(options, sessionUser || currentUser(), allowed);
            }, function () {
                decide(options, null, allowed);
            });
            return;
        }
        if (global.layout && layout.addReady && !layout.isReady) {
            layout.addReady(function () {
                authorize(options, allowed);
            });
            return;
        }
        decide(options, null, allowed);
    }

    function load(scriptUrl, options) {
        authorize(options, function () {
            var script = global.document.createElement("script");
            script.src = scriptUrl;
            script.async = false;
            (global.document.body || global.document.head || global.document.documentElement).appendChild(script);
        });
    }

    function afterLogin(user, allowed) {
        syncServerClock(function () {
            decide({allowMaintenanceLogin: true}, user, allowed);
        });
    }

    global.O2SystemStopGate = {
        authorize: authorize,
        load: load,
        afterLogin: afterLogin,
        showNotice: showNotice,
        isStopped: function () {
            return now() >= STOP_AT;
        },
        diagnostics: function () {
            var user = currentUser();
            return {
                version: GATE_VERSION,
                stopAt: STOP_AT,
                browserNow: global.Date.now(),
                effectiveNow: now(),
                serverClockBase: serverClockBase,
                clockOffset: clockOffset,
                clockSource: clockSource,
                serverTimeText: serverTimeText,
                clockReady: clockReady,
                clockError: clockError,
                blocked: blocked,
                user: user ? {
                    name: user.name || "",
                    unique: user.unique || "",
                    distinguishedName: user.distinguishedName || "",
                    tokenType: user.tokenType || ""
                } : null
            };
        },
        notice: NOTICE,
        exemptPerson: EXEMPT_PERSON
    };

    // Start clock calibration as early as possible; authorize() waits for it when necessary.
    syncServerClock(function () {});
}(window));
