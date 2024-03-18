package com.x.cms.assemble.control;

import com.google.gson.JsonObject;
import com.x.base.core.project.config.Config;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import org.jodconverter.core.office.OfficeManager;
import org.jodconverter.local.office.LocalOfficeManager;


public class OfficeManagerInstance {

    private static Logger logger = LoggerFactory.getLogger( OfficeManagerInstance.class );

    private static OfficeManager INSTANCE = null;

    private static String[] portNumbers = {"8100"};

    private static String officeHome = "/opt/libreoffice7.6";
//    private static String officeHome = "/Applications/LibreOffice.app/Contents";

    public static synchronized void startInit() {
        if(INSTANCE != null) {
            stop();
        }
        try {
            JsonObject jsonObject = Config.customConfig("custom_libreoffice");
            if(jsonObject!=null) {
                if(jsonObject.has("officeHome") && jsonObject.has("portNumbers")){
                    officeHome = jsonObject.get("officeHome").getAsString();
                    portNumbers = jsonObject.get("portNumbers").getAsString().split(",");
                    logger.info("init libreoffice config officeHome:{}, portNumbers:{}", officeHome, portNumbers);
                    init();
                }
            }
        } catch (Exception e) {
            logger.error(e);
        }
    }

    public static synchronized void start() {
        if(INSTANCE == null) {
            init();
        }else{
            officeManagerStart();
        }
    }

    public static synchronized void stop() {
        if(INSTANCE!=null && INSTANCE.isRunning()){
            try {
                INSTANCE.stop();
                INSTANCE = null;
            } catch (Exception e) {
                logger.error(e);
            }
        }
    }

    private static void init() {
        try {
            int[] ports = new int[portNumbers.length];

            for (int i = 0; i < portNumbers.length; i++) {
                ports[i] = Integer.parseInt(portNumbers[i]);
            }

            LocalOfficeManager.Builder builder = LocalOfficeManager.builder().install();
            builder.officeHome(officeHome);
            builder.portNumbers(ports);
            builder.taskExecutionTimeout(Long.valueOf( 3 * 1000 * 60 ));
            builder.taskQueueTimeout(Long.valueOf(6) * 1000 * 60);
            INSTANCE = builder.build();
            officeManagerStart();
        } catch (Exception e) {
            logger.error(e);
        }
    }

    private static void officeManagerStart() {
        if (INSTANCE.isRunning()) {
            return;
        }
        try {
            INSTANCE.start();
        } catch (Exception e) {
            logger.error(e);
        }
    }
}
