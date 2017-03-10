package com.x.bbs.assemble.control.jaxrs.subjectinfo;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.JsonElement;
import com.x.base.core.application.jaxrs.AbstractJaxrsAction;
import com.x.base.core.bean.BeanCopyTools;
import com.x.base.core.bean.BeanCopyToolsBuilder;
import com.x.base.core.http.ActionResult;
import com.x.base.core.http.EffectivePerson;
import com.x.base.core.http.HttpMediaType;
import com.x.base.core.http.ResponseFactory;
import com.x.base.core.http.annotation.HttpMethodDescribe;
import com.x.base.core.logger.Logger;
import com.x.base.core.logger.LoggerFactory;
import com.x.base.core.utils.SortTools;
import com.x.bbs.assemble.control.service.BBSForumInfoServiceAdv;
import com.x.bbs.assemble.control.service.BBSSectionInfoServiceAdv;
import com.x.bbs.assemble.control.service.BBSSubjectInfoServiceAdv;
import com.x.bbs.assemble.control.service.BBSSubjectVoteService;
import com.x.bbs.assemble.control.service.UserManagerService;
import com.x.bbs.entity.BBSPermissionInfo;
import com.x.bbs.entity.BBSSectionInfo;
import com.x.bbs.entity.BBSSubjectAttachment;
import com.x.bbs.entity.BBSSubjectInfo;
import com.x.bbs.entity.BBSVoteOption;

@Path("subject")
public class SubjectInfoAction extends AbstractJaxrsAction {
	private Logger logger = LoggerFactory.getLogger( SubjectInfoAction.class );
	private BBSSubjectVoteService subjectVoteService = new BBSSubjectVoteService();
	private BBSSubjectInfoServiceAdv subjectInfoServiceAdv = new BBSSubjectInfoServiceAdv();
	private BBSSectionInfoServiceAdv sectionInfoServiceAdv = new BBSSectionInfoServiceAdv();
	private BBSForumInfoServiceAdv forumInfoServiceAdv = new BBSForumInfoServiceAdv();
	private UserManagerService userManagerService = new UserManagerService();
	private BeanCopyTools< BBSSubjectAttachment, WrapOutSubjectAttachment > attachmentWrapout_copier = BeanCopyToolsBuilder.create( BBSSubjectAttachment.class, WrapOutSubjectAttachment.class, null, WrapOutSubjectAttachment.Excludes);
	private BeanCopyTools< BBSSubjectInfo, WrapOutSubjectInfo > wrapout_copier = BeanCopyToolsBuilder.create( BBSSubjectInfo.class, WrapOutSubjectInfo.class, null, WrapOutSubjectInfo.Excludes);
	private BeanCopyTools< BBSVoteOption, WrapOutBBSVoteOption > voteOptionWrapout_copier = BeanCopyToolsBuilder.create( BBSVoteOption.class, WrapOutBBSVoteOption.class, null, WrapOutBBSVoteOption.Excludes);
	
	@HttpMethodDescribe(value = "列示根据过滤条件的推荐主题列表.", response = WrapOutSubjectInfo.class, request = JsonElement.class)
	@PUT
	@Path("recommended/list/page/{page}/count/{count}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response listRecommendedSubjectForPage( @Context HttpServletRequest request, @PathParam("page") Integer page, @PathParam("count") Integer count, JsonElement jsonElement ) {
		ActionResult<List<WrapOutSubjectInfo>> result = new ActionResult<>();
		EffectivePerson currentPerson = this.effectivePerson(request);
		List<WrapOutSubjectInfo> wraps = new ArrayList<>();
		List<BBSSubjectInfo> subjectInfoList = null;
		List<BBSSubjectInfo> subjectInfoList_out = new ArrayList<BBSSubjectInfo>();
		Long total = 0L;
		String searchForumId = null;
		String searchSectionId = null;
		String searchMainSectionId = null;
		WrapInFilter wrapIn = null;
		Boolean check = true;
		if( check ){
			if( jsonElement == null ){
				wrapIn = new WrapInFilter();
			}
		}else{
			try {
				wrapIn = this.convertToWrapIn( jsonElement, WrapInFilter.class );
			} catch (Exception e ) {
				check = false;
				Exception exception = new WrapInConvertException( e, jsonElement );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		
		if( check ){
			if( page == null ){
				page = 1;
			}
		}
		if( check ){
			if( count == null ){
				count = 20;
			}
		}
		if( check ){
			try{
				total = subjectInfoServiceAdv.countRecommendedSubjectInSectionForPage( searchForumId, searchMainSectionId, searchSectionId, wrapIn.getCreatorName() );
			} catch (Exception e) {
				check = false;
				logger.warn( "system query creamed subject count got an exceptin." );
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( check ){
			if( total > 0 ){
				try{
					subjectInfoList = subjectInfoServiceAdv.listRecommendedSubjectInSectionForPage( searchForumId, searchMainSectionId, searchSectionId, wrapIn.getCreatorName(), page*count );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectFilterException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if( check ){
			if( page <= 0 ){
				page = 1;
			}
			if( count <= 0 ){
				count = 20;
			}
			int startIndex = ( page - 1 ) * count;
			int endIndex = page * count;
			for( int i=0; subjectInfoList != null && i< subjectInfoList.size(); i++ ){
				if( i < subjectInfoList.size() && i >= startIndex && i < endIndex ){
					subjectInfoList_out.add( subjectInfoList.get( i ) );
				}
			}
			if( subjectInfoList_out != null && !subjectInfoList_out.isEmpty() ){
				try {
					wraps = wrapout_copier.copy( subjectInfoList_out );
					result.setData( wraps );
					result.setCount( total );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	@HttpMethodDescribe(value = "获取所有推荐到BBS首页的主题列表.", response = WrapOutSubjectInfo.class)
	@GET
	@Path("recommended/index/{count}")
	@Produces( HttpMediaType.APPLICATION_JSON_UTF_8 )
	@Consumes( MediaType.APPLICATION_JSON )
	public Response listRecommendedSubjectForBBSIndex( @Context HttpServletRequest request, @PathParam("count") Integer count ) {
		ActionResult<List<WrapOutSubjectInfo>> result = new ActionResult<>();
		List<WrapOutSubjectInfo> wraps = new ArrayList<>();
		List<BBSSubjectInfo> subjectInfoList = null;
		List<String> viewSectionIds = new ArrayList<String>();
		EffectivePerson currentPerson = this.effectivePerson( request );
		Boolean check = true;		
		if( check ){
			if( count == null || count <= 0 ){
				count = 10;
			}
		}
		if( check ){
			viewSectionIds = getViewableSectionIds( request, result, currentPerson );
		}
		if( check ){
			try {
				subjectInfoList = subjectInfoServiceAdv.listRecommendedSubjectForBBSIndex( viewSectionIds, count );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( check ){
			if( subjectInfoList != null && !subjectInfoList.isEmpty() ){
				try {
					wraps = wrapout_copier.copy( subjectInfoList );
					SortTools.desc( wraps, true, "updateTime" );
					result.setData( wraps );
					result.setCount( Long.parseLong( wraps.size() + "" ) );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}	
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	//所有的置顶贴应该全部取出
	@HttpMethodDescribe(value = "获取所有可以取到的置顶贴列表.", response = WrapOutSubjectInfo.class)
	@GET
	@Path("top/{sectionId}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response listTopSubject( @Context HttpServletRequest request, @PathParam("sectionId") String sectionId) {
		ActionResult<List<WrapOutSubjectInfo>> result = new ActionResult<>();
		List<WrapOutSubjectInfo> wraps = new ArrayList<>();
		List<BBSSubjectInfo> subjectInfoList = null;
		BBSSectionInfo sectionInfo = null;
		List<String> viewSectionIds = null;
		Boolean check = true;
		EffectivePerson currentPerson = this.effectivePerson( request );
		
		if (check) {
			if ( sectionId == null || sectionId.isEmpty() ) {
				check = false;
				Exception exception = new SectionIdEmptyException();
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if (check) {// 查询版块信息是否存在
			try {
				sectionInfo = sectionInfoServiceAdv.get( sectionId );
			} catch (Exception e) {
				check = false;
				Exception exception = new SectionQueryByIdException( e, sectionId );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if (check) {
			if (sectionInfo == null) {
				check = false;
				Exception exception = new SectionNotExistsException( sectionId );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( check ){
			viewSectionIds = getViewableSectionIds( request, result, currentPerson );
		}
		if (check) {
			try {
				subjectInfoList = subjectInfoServiceAdv.listAllTopSubject( sectionInfo, null, viewSectionIds );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if (check) {
			if ( subjectInfoList != null && !subjectInfoList.isEmpty() ) {
				try {
					wraps = wrapout_copier.copy(subjectInfoList);
					SortTools.desc(wraps, true, "latestReplyTime");
					result.setData(wraps);
					result.setCount(Long.parseLong(wraps.size() + ""));
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}

	@HttpMethodDescribe(value = "列示根据过滤条件的精华主题列表.", response = WrapOutSubjectInfo.class, request = JsonElement.class)
	@PUT
	@Path("creamed/list/page/{page}/count/{count}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response listCreamedSubjectForPage( @Context HttpServletRequest request, @PathParam("page") Integer page, @PathParam("count") Integer count, JsonElement jsonElement ) {
		ActionResult<List<WrapOutSubjectInfo>> result = new ActionResult<>();
		EffectivePerson currentPerson = this.effectivePerson(request);
		List<WrapOutSubjectInfo> wraps = new ArrayList<>();
		List<BBSSubjectInfo> subjectInfoList = null;
		List<BBSSubjectInfo> subjectInfoList_out = new ArrayList<BBSSubjectInfo>();
		Long total = 0L;
		WrapInFilter wrapIn = null;
		Boolean check = true;
		
		try {
			wrapIn = this.convertToWrapIn( jsonElement, WrapInFilter.class );
		} catch (Exception e ) {
			check = false;
			Exception exception = new WrapInConvertException( e, jsonElement );
			result.error( exception );
			logger.error( exception, currentPerson, request, null);
		}

		if( check ){
			if( page == null ){
				page = 1;
			}
		}
		if( check ){
			if( count == null ){
				count = 20;
			}
		}
		if( check ){
			try{
				total = subjectInfoServiceAdv.countCreamedSubjectInSectionForPage( wrapIn.getForumId(), wrapIn.getMainSectionId(), wrapIn.getSectionId(), wrapIn.getCreatorName() );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( check ){
			if( total > 0 ){
				try{
					subjectInfoList = subjectInfoServiceAdv.listCreamedSubjectInSectionForPage( wrapIn.getForumId(), wrapIn.getMainSectionId(), wrapIn.getSectionId(), wrapIn.getCreatorName(), page*count );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectFilterException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if( check ){
			if( page <= 0 ){
				page = 1;
			}
			if( count <= 0 ){
				count = 20;
			}
			int startIndex = ( page - 1 ) * count;
			int endIndex = page * count;
			for( int i=0; subjectInfoList != null && i< subjectInfoList.size(); i++ ){
				if( i < subjectInfoList.size() && i >= startIndex && i < endIndex ){
					subjectInfoList_out.add( subjectInfoList.get( i ) );
				}
			}
			if( subjectInfoList_out != null && !subjectInfoList_out.isEmpty() ){
				try {
					wraps = wrapout_copier.copy( subjectInfoList_out );
					result.setData( wraps );
					result.setCount( total );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	@HttpMethodDescribe(value = "列示根据过滤条件的SubjectInfo,下一页.", response = WrapOutSubjectInfo.class, request = JsonElement.class)
	@PUT
	@Path("filter/list/page/{page}/count/{count}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response listSubjectForPage( @Context HttpServletRequest request, @PathParam("page") Integer page, @PathParam("count") Integer count, JsonElement jsonElement ) {
		ActionResult<List<WrapOutSubjectInfo>> result = new ActionResult<>();
		List<WrapOutSubjectInfo> wraps_nonTop = new ArrayList<>();
		List<WrapOutSubjectInfo> wraps_top = new ArrayList<>();
		List<WrapOutSubjectInfo> wraps_out = new ArrayList<WrapOutSubjectInfo>();
		BBSSectionInfo sectionInfo = null;
		List<BBSSubjectInfo> subjectInfoList = null;
		List<BBSSubjectInfo> subjectInfoList_top = null;
		List<String> viewSectionIds = new ArrayList<String>();
		EffectivePerson currentPerson = this.effectivePerson( request );
		Integer selectTotal = 0;
		Long total = 0L;
		Integer topTotal = 0;
		Boolean check = true;
		String base64Content = null;
		WrapInFilter wrapIn = null;
		
		try {
			wrapIn = this.convertToWrapIn( jsonElement, WrapInFilter.class );
		} catch (Exception e ) {
			check = false;
			Exception exception = new WrapInConvertException( e, jsonElement );
			result.error( exception );
			logger.error( exception, currentPerson, request, null);
		}
		if( wrapIn.getSectionId() != null && !wrapIn.getSectionId().isEmpty() ){
			if (check) {
				try {
					sectionInfo = sectionInfoServiceAdv.get( wrapIn.getSectionId() );
				} catch (Exception e) {
					check = false;
					Exception exception = new SectionQueryByIdException( e, wrapIn.getSectionId() );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
			if (check) {
				if ( sectionInfo == null ) {
					check = false;
					Exception exception = new SectionNotExistsException( wrapIn.getSectionId() );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		
		if( check ){
			viewSectionIds = getViewableSectionIds( request, result, currentPerson );
		}
		if( check ){
			if( page == null ){
				page = 1;
			}
		}
		if( check ){
			if( count == null ){
				count = 20;
			}
		}
		//查询的最大条目数
		selectTotal = page * count;
		
		Boolean selectTopInSection = null;//默认是将版块内所有的置顶和非置顶贴全部查出
		//查询出所有的置顶贴
		if ( check && wrapIn != null && wrapIn.getWithTopSubject() != null && wrapIn.getWithTopSubject() ) {
			selectTopInSection = false; //如果已经查询过置顶贴,那么查询版块列表时就不用查询置顶贴了.
			try {
				subjectInfoList_top = subjectInfoServiceAdv.listAllTopSubject( sectionInfo, wrapIn.getCreatorName(), viewSectionIds );
				if( subjectInfoList_top != null ){
					topTotal = subjectInfoList_top.size();
					try {
						wraps_top = wrapout_copier.copy( subjectInfoList_top );
						SortTools.desc( wraps_top, "latestReplyTime" );
					} catch (Exception e) {
						Exception exception = new SubjectWrapOutException( e );
						result.error( exception );
						logger.error( exception, currentPerson, request, null);
					}
				}
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( wrapIn.getWithTopSubject() != null && !wrapIn.getWithTopSubject() ){
			selectTopInSection = false; //不查询置顶贴
		}
		
		if( check ){
			if( wraps_top != null ){
				if( selectTotal < wraps_top.size() ){
					selectTotal = 0;
				}else{
					selectTotal = selectTotal - wraps_top.size();
				}
			}
		}
		if( check ){
			if( selectTotal > 0 ){
				try{
					total = subjectInfoServiceAdv.countSubjectInSectionForPage( wrapIn.getForumId(), wrapIn.getMainSectionId(), wrapIn.getSectionId(), wrapIn.getCreatorName(), wrapIn.getNeedPicture(), selectTopInSection, viewSectionIds );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectFilterException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if( check ){
			if( selectTotal > 0 && total > 0 ){
				try{
					subjectInfoList = subjectInfoServiceAdv.listSubjectInSectionForPage( wrapIn.getForumId(), wrapIn.getMainSectionId(), wrapIn.getSectionId(), wrapIn.getCreatorName(), wrapIn.getNeedPicture(), selectTopInSection, selectTotal, viewSectionIds );
					if( subjectInfoList != null ){
						try {
							wraps_nonTop = wrapout_copier.copy( subjectInfoList );
							SortTools.desc( wraps_nonTop, "latestReplyTime" );
						} catch (Exception e) {
							Exception exception = new SubjectWrapOutException( e );
							result.error( exception );
							logger.error( exception, currentPerson, request, null);
						}
					}
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectFilterException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if( check ){
			if( page <= 0 ){
				page = 1;
			}
			if( count <= 0 ){
				count = 20;
			}
			int startIndex = ( page - 1 ) * count;
			int endIndex = page * count;
			int i = 0;
			for( ; wraps_top != null && i< wraps_top.size(); i++ ){
				if( i >= startIndex && i < endIndex ){
					wraps_out.add( wraps_top.get( i ) );
				}
			}
			for( int j=0; wraps_nonTop != null && j< wraps_nonTop.size(); j++ ){
				if( i+j >= startIndex && i+j < endIndex ){
					wraps_out.add( wraps_nonTop.get( j ) );
				}
			}
			if( check ){
				//如果需要图片,那么补充一下图片的base64编码
				if( wrapIn.getNeedPicture() !=null && wrapIn.getNeedPicture() && wraps_out != null && !wraps_out.isEmpty() ){
					for( WrapOutSubjectInfo wrapOutSubjectInfo : wraps_out ){
						try {
							base64Content = subjectInfoServiceAdv.getPictureBase64( wrapOutSubjectInfo.getId() );
							if( base64Content != null ){
								wrapOutSubjectInfo.setPictureBase64( base64Content );
							}
						} catch (Exception e) {
							check = false;
							Exception exception = new SubjectQueryPicBase64Exception( e, wrapOutSubjectInfo.getId() );
							result.error( exception );
							logger.error( exception, currentPerson, request, null);
						}
					}
				}
			}
			if( wraps_out != null && !wraps_out.isEmpty() ){
				try {
					result.setData( wraps_out );
					result.setCount( total + topTotal );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	private List<String> getViewableSectionIds( HttpServletRequest request, ActionResult<List<WrapOutSubjectInfo>> result, EffectivePerson currentPerson ) {
		List<BBSSectionInfo> sectionInfoList = null;
		List<BBSSectionInfo> subSectionInfoList = null;
		List<BBSPermissionInfo> permissonList = null;
		List<String> publicForumIds = null;
		List<String> publicSectionIds = null;
		List<String> viewforumIds = new ArrayList<String>();
		List<String> viewSectionIds = new ArrayList<String>();
		Boolean check = true;
		if( check ){
			permissonList = userManagerService.getUserPermissionInfoList( currentPerson.getName() );
		}
		if( check ){
			if( permissonList != null ){
				for( BBSPermissionInfo permissionInfo : permissonList ){
					if( "FORUM_VIEW".equals( permissionInfo.getPermissionType() ) && !viewforumIds.contains( permissionInfo.getForumId() )){
						viewforumIds.add( permissionInfo.getForumId() );
					}
					if( "SECTION_VIEW".equals( permissionInfo.getPermissionType() ) && !viewSectionIds.contains( permissionInfo.getSectionId() )){
						viewSectionIds.add( permissionInfo.getSectionId() );
					}
				}
			}
		}
		if( check ){
			try {
				publicForumIds = forumInfoServiceAdv.listAllPublicForumIds();
				if( publicForumIds != null ){
					for( String _id : publicForumIds ){
						if( !viewforumIds.contains( _id )){
							viewforumIds.add( _id );
						}
					}
				}
			} catch (Exception e) {
				check = false;
				logger.warn( "system query all public forum got an exceptin.", e );
			}
		}
		if( check ){
			try {
				publicSectionIds = sectionInfoServiceAdv.viewSectionByForumIds( viewforumIds, true );
			} catch (Exception e) {
				check = false;
				logger.warn( "system query all public section with forumIds got an exceptin." );
				Exception exception = new PublicSectionFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( check ){
			try {
				sectionInfoList = sectionInfoServiceAdv.list( publicSectionIds );
				if( sectionInfoList != null ){
					for( BBSSectionInfo _sectionInfo : sectionInfoList ){
						if( !viewSectionIds.contains( _sectionInfo.getId() )){
							viewSectionIds.add( _sectionInfo.getId() );
						}
						if( "主板块".equals( _sectionInfo.getSectionLevel() ) ){
							subSectionInfoList = sectionInfoServiceAdv.listSubSectionByMainSectionId( _sectionInfo.getId() );
							if( subSectionInfoList != null ){
								for( BBSSectionInfo _subSectionInfo : subSectionInfoList ){
									if( !viewSectionIds.contains( _subSectionInfo.getId() )){
										viewSectionIds.add( _subSectionInfo.getId() );
									}
								}
							}
						}
					}
				}
			} catch (Exception e) {
				check = false;
				Exception exception = new SectionListByIdsException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		return viewSectionIds;
	}

	@HttpMethodDescribe(value = "列示根据过滤条件的SubjectInfo,下一页.", response = WrapOutSubjectInfo.class, request = JsonElement.class)
	@PUT
	@Path("search/list/page/{page}/count/{count}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response searchSubjectForPage( @Context HttpServletRequest request, @PathParam("page") Integer page, @PathParam("count") Integer count, JsonElement jsonElement ) {
		ActionResult<List<WrapOutSubjectInfo>> result = new ActionResult<>();
		List<WrapOutSubjectInfo> wraps = new ArrayList<>();
		List<BBSSubjectInfo> subjectInfoList = null;
		List<BBSSubjectInfo> subjectInfoList_out = new ArrayList<BBSSubjectInfo>();
		EffectivePerson currentPerson = this.effectivePerson( request );
		List<String> viewSectionIds = new ArrayList<String>();
		Long total = 0L;
		WrapInFilter wrapIn = null;
		Boolean check = true;
		
		if( jsonElement == null ){
			wrapIn = new WrapInFilter();
		}else{
			try {
				wrapIn = this.convertToWrapIn( jsonElement, WrapInFilter.class );
			} catch (Exception e ) {
				check = false;
				Exception exception = new WrapInConvertException( e, jsonElement );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		
		if( check ){
			if( page == null ){
				page = 1;
			}
		}
		if( check ){
			if( count == null ){
				count = 20;
			}
		}
		if( check ){
			viewSectionIds = getViewableSectionIds( request, result, currentPerson );
		}
		if( check ){
			try{
				total = subjectInfoServiceAdv.countSubjectSearchInSectionForPage( wrapIn.getSearchContent(), viewSectionIds );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if( check ){
			if( total > 0 ){
				try{
					subjectInfoList = subjectInfoServiceAdv.listSubjectSearchInSectionForPage( wrapIn.getSearchContent(), viewSectionIds, page*count );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectFilterException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if( check ){
			if( page <= 0 ){
				page = 1;
			}
			if( count <= 0 ){
				count = 20;
			}
			int startIndex = ( page - 1 ) * count;
			int endIndex = page * count;
			for( int i=0; subjectInfoList != null && i< subjectInfoList.size(); i++ ){
				if( i < subjectInfoList.size() && i >= startIndex && i < endIndex ){
					subjectInfoList_out.add( subjectInfoList.get( i ) );
				}
			}
			if( subjectInfoList_out != null && !subjectInfoList_out.isEmpty() ){
				try {
					wraps = wrapout_copier.copy( subjectInfoList_out );
					result.setData( wraps );
					result.setCount( total );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	@HttpMethodDescribe(value = "根据指定ID查看主题具体信息，需要记录查询次数和热度的.", response = WrapOutNearSubjectInfo.class)
	@GET
	@Path("view/{id}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response viewSubject( @Context HttpServletRequest request, @PathParam("id") String id ) {
		ActionResult<WrapOutNearSubjectInfo> result = new ActionResult<>();
		EffectivePerson currentPerson = this.effectivePerson(request);
		List<WrapOutSubjectAttachment> wrapSubjectAttachmentList = null;
		List<BBSSubjectAttachment> subjectAttachmentList = null;
		WrapOutNearSubjectInfo wrapOutNearSubjectInfo = new WrapOutNearSubjectInfo();
		WrapOutSubjectInfo lastSubject = null;
		WrapOutSubjectInfo currentSubject = null;
		WrapOutSubjectInfo nextSubject = null;
		BBSSubjectInfo subjectInfo = null;
		String subjectVoteResult = null;
		String optionBinaryContent = null;
		List<BBSVoteOption> voteOptionList = null;
		List<WrapOutBBSVoteOption> wrapOutSubjectVoteOptionList = null;
		String subjectContent = null;
		Boolean check = true;
		if( check ){
			if( id == null || id.isEmpty() ){
				check = false;
				Exception exception = new SubjectIdEmptyException();
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if (check) {//查询版块信息是否存在
			try {
				subjectInfo = subjectInfoServiceAdv.view( id );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectViewException( e, id );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		
		if (check) {
			if ( subjectInfo == null ) {
				check = false;
				Exception exception = new SubjectNotExistsException( id );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}else{//查到了主题信息
				try {
					currentSubject = wrapout_copier.copy( subjectInfo );
					//根据附件ID列表查询附件信息
					if( currentSubject.getAttachmentList() != null && currentSubject.getAttachmentList().size() > 0 ){
						subjectAttachmentList = subjectInfoServiceAdv.listAttachmentByIds( currentSubject.getAttachmentList() );
						if( subjectAttachmentList != null && subjectAttachmentList.size() > 0 ){
							wrapSubjectAttachmentList = attachmentWrapout_copier.copy( subjectAttachmentList );
							currentSubject.setSubjectAttachmentList( wrapSubjectAttachmentList );
						}
					}
					wrapOutNearSubjectInfo.setCurrentSubject( currentSubject );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}			
		}
		if (check) {
			if( wrapOutNearSubjectInfo.getCurrentSubject() != null ){
				currentSubject = wrapOutNearSubjectInfo.getCurrentSubject();
				//填充主题的内容信息
				try {
					subjectContent = subjectInfoServiceAdv.getSubjectContent( id );
					if( subjectContent != null ){
						currentSubject.setContent( subjectContent );
					}
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectContentQueryByIdException( e, id );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		//开始查询上一个主题的信息
		if (check) {
			try {
				subjectInfo = subjectInfoServiceAdv.getLastSubject( id );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if (check) {
			if( subjectInfo != null ){
				lastSubject = new WrapOutSubjectInfo();
				lastSubject.setId( subjectInfo.getId() );
				lastSubject.setTitle( subjectInfo.getTitle() );
				wrapOutNearSubjectInfo.setLastSubject( lastSubject );
			}
		}
		//开始查询下一个主题的信息
		if (check) {
			try {
				subjectInfo = subjectInfoServiceAdv.getNextSubject( id );
			} catch (Exception e) {
				check = false;
				Exception exception = new SubjectFilterException( e );
				result.error( exception );
				logger.error( exception, currentPerson, request, null);
			}
		}
		if (check) {
			if( subjectInfo != null ){
				nextSubject = new WrapOutSubjectInfo();
				nextSubject.setId( subjectInfo.getId() );
				nextSubject.setTitle( subjectInfo.getTitle() );
				wrapOutNearSubjectInfo.setNextSubject( nextSubject );
			}
		}
		if (check) {
			if( currentSubject != null ){//获取该主题的投票选项
				try {
					voteOptionList = subjectVoteService.listVoteOption( id );
				} catch (Exception e) {
					check = false;
					Exception exception = new VoteOptionListByIdException( e, id );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if (check) {
			if( voteOptionList != null  && !voteOptionList.isEmpty() ){
				try {
					wrapOutSubjectVoteOptionList = voteOptionWrapout_copier.copy( voteOptionList );
				} catch (Exception e) {
					check = false;
					Exception exception = new SubjectWrapOutException( e );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		if (check) {
			if( wrapOutSubjectVoteOptionList != null  && !wrapOutSubjectVoteOptionList.isEmpty() ){
				for( WrapOutBBSVoteOption option : wrapOutSubjectVoteOptionList ){
					//获取图片编码
					try {
						optionBinaryContent = subjectVoteService.getOptionBinaryContent( option.getId() );
						option.setOptionBinary( optionBinaryContent );
					} catch (Exception e) {
						check = false;
						Exception exception = new VoteOptionBinaryQueryByIdException( e, option.getId() );
						result.error( exception );
						logger.error( exception, currentPerson, request, null);
					}
				}
			}
		}
		if (check) {
			if( wrapOutSubjectVoteOptionList != null  && !wrapOutSubjectVoteOptionList.isEmpty() ){
				currentSubject.setVoteOptionList( wrapOutSubjectVoteOptionList );
			}
		}
		if ( check ) {
			if( currentSubject != null ){
				//获取该主题的投票结果
				try {
					subjectVoteResult = subjectVoteService.getVoteResult( id );
					currentSubject.setVoteResult( subjectVoteResult );
				} catch (Exception e) {
					check = false;
					Exception exception = new VoteResultQueryByIdException( e, id );
					result.error( exception );
					logger.error( exception, currentPerson, request, null);
				}
			}
		}
		result.setData( wrapOutNearSubjectInfo );
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
}