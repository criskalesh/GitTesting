package com.pacemaker.ecom.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.pacemaker.ecom.model.Member;

@Component	
public class PacemakerUtil {
	
	private static final Logger logger = Logger.getLogger(PacemakerUtil.class);
	private static PacemakerConstants serviceConstants = new PacemakerConstants();  
	
	public List<Member> getSummaryList(){
		List<Member> list = new ArrayList<Member>(serviceConstants.summaryList.values());
		logger.info("Inside method getSummaryList - util");
		return list;
	}
	
	public HashMap<String, Member> getSummaryMap(){
		HashMap<String, Member> summaryMap = new HashMap<String, Member>(serviceConstants.summaryList);
		logger.info("Inside method getSummaryMap - util");
		return summaryMap;
	}
	
}
