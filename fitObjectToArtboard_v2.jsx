#target Illustrator
 
//  script.name = fitObjectToArtboardBounds_v2.jsx;
//  script.description = resizes selected object(s) to fit to the Artboard(s) Bounds;
//  script.required = select ONE object before running; CS4 & CS5 Only.
//  script.parent = carlos canto // 08/05/12;
//  script.elegant = false;


// script.updates = first version fitted a single object to the active artboard.
// 					for this version, I added options for fitting selected object to all the artboards.
//					 it also works with multiple selections, all selected objects will be processed at once.
//					 Bonus: there's an option for adding padding to object's final size.


var idoc = app.activeDocument;
selec = idoc.selection;
if (selec.length>0) {
	
	var title = "Fit Selected Object(s) to Artboard(s)";
	var msg = "Enter Margins in points\n";
	msg += "Positive: Outside Artboard, Negative: Inside Artboard";
	msg += "\nEnter 0 to fit exactly to Artboard Bounds";

	var margins = Number(Window.prompt (msg, 0, title));
	//var margins = Number(Window.prompt (msg, 0, title))*2.834645669; // 1 mm = 2.834645669 pts
	
	var allArtboards = Window.confirm ("Yes - All Artboards \nNo - Active Artboard", false, title);
	
	for (j=0; j<selec.length; j++) {
		// get selection bounds
		var boundsdiff = getPgItemGBoundsvsVBoundsDifference (selec[j]);
		
		if (allArtboards) {
			//alert(allArtboards);

			var ABs = idoc.artboards;
			for(i=0; i<ABs.length; i++) {
				var activeAB = ABs[i];
				var ABprops = getABbounds (activeAB, margins); // get top, left, width & height
				
				var sel = selec[j].duplicate(); // idoc.selection[0];
				fitPgItem (sel, ABprops, boundsdiff);
			}
		}
		else {
			//alert(allArtboards);
			var activeAB = idoc.artboards[idoc.artboards.getActiveArtboardIndex()]; // get active AB
			var ABprops = getABbounds (activeAB, margins); // get top, left, width & height
			var sel = selec[j].duplicate(); // idoc.selection[0];
			fitPgItem (sel, ABprops, boundsdiff);
		}
	} // end if there's something selected

	//idoc.selection = null;
	//selec[0].selected = true;
}
else {
	alert("select something before running");
}

//--------------------------------------------------------------------------------------------------------
// move and resize pgItem
function fitPgItem(pgItem, containerProps, pgItemBoundsDiff) {
	var sel = pgItem;
	var ABprops = containerProps;
	var boundsdiff = pgItemBoundsDiff;
	
	sel.width = ABprops.width-boundsdiff.deltaX; // width is Geometric width, so we need to make it smaller...to accomodate the visible portion.
	sel.height = ABprops.height-boundsdiff.deltaY;
	sel.top = ABprops.top; // Top is actually Visible top
	sel.left = ABprops.left; // dito for Left
	sel.selected = false;
}
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
//returns a pageItem's VisibleBounds vs GeometricBounds Difference
// needed to substract from an item's width/height since they're based on Geometric width/height
function getPgItemGBoundsvsVBoundsDifference (pgitem) {
	// get selection bounds
	var sel = pgitem;
	var selVB = sel.visibleBounds;
	var selVw = selVB[2]-selVB[0];
	var selVh = selVB[1]-selVB[3];

	var selGB = sel.geometricBounds;
	var selGw = selGB[2]-selGB[0];
	var selGh = selGB[1]-selGB[3];

	// get the difference between Visible & Geometric Bounds
	var deltaX = selVw-selGw;
	var deltaY = selVh-selGh;
	
	return deltaxy = {deltaX:deltaX, deltaY:deltaY};
}
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
// returns an Artboard with top, left, width & height properties, including Margins
function getABbounds (artboard, padding) { 
	var activeAB = artboard;
	var margins = padding;
	
	var abBounds = activeAB.artboardRect; // get bounds [left, top, right, bottom]
	var ableft = abBounds[0]-margins;
	var abtop = abBounds[1]+margins;
	var abright = abBounds[2]+margins;
	var abbottom = abBounds[3]-margins;

	var abwidth = abright-ableft;
	var abheight = abtop-abbottom;

	return AB = {left:ableft, top:abtop, width:abwidth, height:abheight};
}
//--------------------------------------------------------------------------------------------------------