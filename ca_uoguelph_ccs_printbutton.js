/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */

ca_uoguelph_ccs_printbutton_HandlerObject = function() {
};
ca_uoguelph_ccs_printbutton_HandlerObject.prototype = new ZmZimletBase;
ca_uoguelph_ccs_printbutton_HandlerObject.prototype.constructor = ca_uoguelph_ccs_printbutton_HandlerObject;

/**
 * This method gets called by the Zimlet framework when a toolbar is created.
 * 
 * http://files.zimbra.com/docs/zimlet/zcs/6.0/jsdocs/symbols/ZmZimletBase.html#initializeToolbar
 */
ca_uoguelph_ccs_printbutton_HandlerObject.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
	var viewType = appCtxt.getViewTypeFromId(viewId);
    if (viewType == ZmId.VIEW_CONVLIST || viewType == ZmId.VIEW_TRAD) {

        var buttonParams = {
                text    : "Print",
                tooltip: "Print selected emails",
                index: 6 // position of the button
        };

        // creates the button with an id and params containing the button details
        var button = toolbar.createOp("UG_PRINTBUTTON", buttonParams);
        button.addSelectionListener(new AjxListener(this, this._printListener, controller)); 
		controller.operationsToEnableOnMultiSelection.push("UG_PRINTBUTTON");
    }
};

/**
 * Shows the selected mail.
 * 
 */
ca_uoguelph_ccs_printbutton_HandlerObject.prototype._printListener =
function(ev) {
	var items = appCtxt.getCurrentController().getSelection();
	items = AjxUtil.toArray(items);
	var ids = [];
	var showImages = false;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		// always extract out the msg ids from the conv
		if (item.toString() == "ZmConv") {
			// get msg ID in case of virtual conv.
			// item.msgIds.length is inconsistent, so checking if conv id is negative.
			if (appCtxt.isOffline && item.id.split(":")[1]<0) {
				ids.push(item.msgIds[0]);
			} else {
				ids.push("C:"+item.id);
			}
			if (item.isZmConv) {
				var msgList = item.getMsgList();
				for(var j=0; j<msgList.length; j++) {
					if(msgList[j].showImages) {
						showImages = true;
						break;
					}
				}
			}
		} else {
			ids.push(item.id);
			if (item.showImages) {
				showImages = true;
			}
		}
	}
	var url = ("/h/printmessage?id=" + ids.join(",")) + "&tz=" + AjxTimezone.getServerId(AjxTimezone.DEFAULT);
	if (appCtxt.get(ZmSetting.DISPLAY_EXTERNAL_IMAGES) || showImages) {
		url = url+"&xim=1";
	}
    if (appCtxt.isOffline) {
        var acctName = items[0].getAccount().name;
        url+="&acct=" + acctName ;
    }
    window.open(appContextPath+url, "_blank");
};
