/**
 * @authorAlexaLewis
 * Create table either empty or with data
 * Features: 
 *  Make better transition from empty table to fill-in table 
 *  Make reasonable size for table or show a full page view of user's completed table
 *  Reset to default for each div (i.e. color, borders, size, font, etc..)
 *  Clear instructions on how to use this
 *  Collapsible divs for editing and styling
 * WISHLIST: 
 *  Print or copy table
 */

var choose_div = document.getElementById("choose"); //animate hiding and showing then bring up table
var fill_in = document.getElementById("fill_in");
var main = document.getElementById("main");
var title = document.getElementById("title");
var table = document.getElementById("my_tbl");
var setup_div = document.getElementById("setup");
var rNum = 0;
var cNum = 0;
var bStyles = ["solid", "dotted", "dashed", "none"];
var colors = ["Black", "Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet", "Brown", "White"];
var fonts = ["Times New Roman", "Georgia", "Garamond", "Arial", "Verdana", "Helvetica", "Courier New", 
            "Lucida Console", "Monaco", "Brush Script MT", "Lucida Handwriting", "Copper Plate", "Papyrus"];

var isEmpty = true;
var isTableFull = false;
var headers = [];


function makeETable(){
    //show-hide choices
    choose_div.style.display = "none";

    //focus more on style: color, border, col by row
    main.style.display = "inline-block";

    title.innerHTML = "EMPTY Table";
    
    addRC();

    isEmpty = true;
    style();

    defaultSettings();
}//makeETable

function addRC(){
    //number of columns
    var col_label = document.createElement("label");
    col_label.appendChild(document.createTextNode("Columns: "));
    //input for column
    var col_input = document.createElement("input");
    col_input.setAttribute("id", "col_input");
    col_input.type = "number";
    col_input.min = "1";
    col_input.value = "2";
    col_input.style.marginInlineEnd = "5px";
    col_input.oninput = function() { setCols(col_input.value) };
    //append to div
    setup_div.appendChild(col_label);
    setup_div.appendChild(col_input);

    //number of rows
    var row_label = document.createElement("label");
    row_label.appendChild(document.createTextNode("Rows: "));
    //input for row
    var row_input = document.createElement("input");
    row_input.setAttribute("id", "row_input");
    row_input.type = "number";
    row_input.min = "1";
    row_input.value = "3";
    row_input.oninput = function() { setRows(row_input.value) };
    //append to div
    setup_div.appendChild(row_label);
    setup_div.appendChild(row_input);

    //default table settings
    rNum = row_input.value;
    cNum = col_input.value;
    for(let i = 0; i < rNum; i++){
        var tr = document.createElement("tr");
        for(let j = 0; j < cNum; j++){
            if(i == 0){
                var th = document.createElement("th");
                tr.appendChild(th);
            }
            else{
                var td = document.createElement("td");
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    }//col+rows
}//addRC

function style(){
    //style heading
    var sh3 = document.createElement("h3");
    sh3.innerHTML = "Style";
    sh3.style.textAlign = "center";
    setup_div.appendChild(sh3);

    //BORDER section
    //border button 
    var borderBtn = document.createElement("button");
    borderBtn.innerHTML = "Border";
    borderBtn.setAttribute("class", "collapsible");
    borderBtn.onclick = function(){ dropCollapseDiv(this) };
    setup_div.appendChild(borderBtn);

    //border div
    var bdiv = document.createElement("div");
    bdiv.setAttribute("id", "border");
    bdiv.setAttribute("class", "set");
    
    //border functions
    //collapse or double border
    tableBorderCollapse(bdiv, "Collapse Borders: ");
    borderSelect(bdiv, "Outer Borders: ", "outerb");
    borderSelect(bdiv, "Header Borders: ", "headerb");
    borderSelect(bdiv, "Inner Borders: ", "innerb");  
    
    //reset button
    var borderResetBtn = document.createElement("button");
    borderResetBtn.innerHTML = "Reset";
    borderResetBtn.setAttribute("class", "resetBtn");
    borderResetBtn.onclick = function(){ borderDefault(); }
    bdiv.appendChild(borderResetBtn);

    setup_div.appendChild(bdiv);


    //COLOR section
    //color button
    var colorBtn = document.createElement("button");
    colorBtn.innerHTML = "Color";
    colorBtn.setAttribute("class", "collapsible");
    colorBtn.onclick = function(){ dropCollapseDiv(this) };
    setup_div.appendChild(colorBtn);

    //color div
    var cdiv = document.createElement("div");
    cdiv.setAttribute("id", "color");
    cdiv.setAttribute("class", "set");

    //colors: background, border, table row, header
    var ch4_ba = document.createElement("h4");
    ch4_ba.innerHTML = "Background";
    cdiv.appendChild(ch4_ba);

    makeRadio(cdiv, "All", "all");
    colorInput(cdiv, "", "bkgd");

    makeRadio(cdiv, "Striped", "striped");
    colorInput(cdiv, "Even: ", "even");
    colorInput(cdiv, "Odd: ", "odd");

    makeRadio(cdiv, "Custom", "custom");
    colorInput(cdiv, "Header Row: ", "th");
    colorInput(cdiv, "Data Rows: ", "td");
    colorInput(cdiv, "Data (Even) Rows: ", "even_cust");
    colorInput(cdiv, "Data (Odd) Rows: ", "odd_cust");

    //border color
    var ch4_bo = document.createElement("h4");
    ch4_bo.innerHTML = "Border";
    ch4_bo.style.marginBottom = "1px";
    cdiv.appendChild(ch4_bo);
    
    colorInput(cdiv, "Outer Borders: ", "oborder");

    //reset button
    var colorResetBtn = document.createElement("button");
    colorResetBtn.innerHTML = "Reset";
    colorResetBtn.setAttribute("class", "resetBtn");
    colorResetBtn.onclick = function(){ colorDefault(); }
    cdiv.appendChild(colorResetBtn);

    setup_div.appendChild(cdiv);


    //FONT section only for fill in table
    if(!isEmpty){
        //font button
        var fontBtn = document.createElement("button");
        fontBtn.innerHTML = "Font";
        fontBtn.setAttribute("class", "collapsible");
        fontBtn.onclick = function(){ dropCollapseDiv(this) };
        setup_div.appendChild(fontBtn);

        //font div
        var fdiv = document.createElement("div");
        fdiv.setAttribute("id", "font");
        fdiv.setAttribute("class", "set");

        //font functions
        fontSelect(fdiv, "Header: ", "fheader");
        fontSelect(fdiv, "Data: ", "fdata");

        //reset button
        var fontResetBtn = document.createElement("button");
        fontResetBtn.innerHTML = "Reset";
        fontResetBtn.setAttribute("class", "resetBtn");
        fontResetBtn.onclick = function(){ fontDefault(); }
        fdiv.appendChild(fontResetBtn);
        
        setup_div.appendChild(fdiv);
    }

    
    //SIZE section
    //size button
    var sizeBtn = document.createElement("button");
    sizeBtn.innerHTML = "Size";
    sizeBtn.setAttribute("class", "collapsible");
    sizeBtn.onclick = function(){ dropCollapseDiv(this) };
    setup_div.appendChild(sizeBtn);

    //size div
    var sdiv = document.createElement("div");
    sdiv.setAttribute("id", "size");
    sdiv.setAttribute("class", "set");

    //thickness of outer border
    sizeRange(sdiv, "Outer Borders: ", "obt_range", "1", "10");
    sizeRange(sdiv, "Inner Borders: ", "ibt_range", "1", "10");
    //width and height
    sizeRange(sdiv, "Header Height Only: ", "header_range", "50", "200");
    sizeRange(sdiv, "Column Width: ", "col_range", "50", "200");
    sizeRange(sdiv, "Row Height: ", "row_range", "50", "200");
    //font size
    if(!isEmpty){
        sizeRange(sdiv, "Header Font: ", "hfont_range", "12", "50");
        sizeRange(sdiv, "Data Font: ", "dfont_range", "12", "50");
    }

    //reset button
    var sizeResetBtn = document.createElement("button");
    sizeResetBtn.innerHTML = "Reset";
    sizeResetBtn.setAttribute("class", "resetBtn");
    sizeResetBtn.onclick = function(){ sizeDefault(); }
    sdiv.appendChild(sizeResetBtn);
    
    setup_div.appendChild(sdiv);
}//style

function dropCollapseDiv(dom){
    //open or close the divs
    var divs = document.getElementsByClassName("set");
    var div = null;
    for(let d = 0; d < divs.length; d++){
        if(divs[d].id == dom.innerHTML.toLowerCase()){
            div = divs[d];
            break;
        }
    } 
    if(div.style.maxHeight){ div.style.maxHeight = null; }
    else{ div.style.maxHeight = div.scrollHeight + "px"; }
    
}//dropCollapseDiv

function defaultSettings(){

    borderDefault();

    colorDefault();

    if(!isEmpty){ fontDefault(); }
    
    sizeDefault();

    //set actual table size
    setRows(3);
    setCols(2);

}//defaultSettings

function borderDefault(){
    //set display to default
    document.getElementById("collapse_cb").checked = true;
    document.getElementById("outerb_sel").selectedIndex = 0;
    document.getElementById("headerb_sel").selectedIndex = 0;
    document.getElementById("innerb_sel").selectedIndex = 0;

    //collpase all the borders in table
    table.style.borderCollapse = "collapse";
    //set style back to solid
    table.style.borderStyle = "solid";

    //table data and header set to solid
    var ths = document.getElementsByTagName("th");
    var tds = document.getElementsByTagName("td");

    for(let i = 0; i < ths.length; i++){
        ths[i].style.borderStyle = "solid";
    }
    for(let i = 0; i < tds.length; i++){
        tds[i].style.borderStyle = "solid";
    }
}//borderDefault

function colorDefault(){
    //set display to default
    //only first is checked
    document.getElementById("all_rad").checked = true;
    document.getElementById("striped_rad").checked = false;
    document.getElementById("custom_rad").checked = false;
    //colors all white except for border color and disable what's not checked
    //select
    var csels = document.getElementsByClassName("color_sel");
    for(let c = 0; c < csels.length-1; c++){
        if(c > 0){
            csels[c].disabled = true;
        }
        else{
            csels[c].disabled = false;
        }
        csels[c].selectedIndex = 9; //select says white
    }
    //color input
    var cinps = document.getElementsByClassName("colorinput");
    for(let c = 0; c < cinps.length-1; c++){
        if(cinps[c].type == "color"){
            //disable the rest that's not under "All" selection
            if(c > 1){
                cinps[c].disabled = true;
            }
            else{
                cinps[c].disabled = false;
            }
            cinps[c].value = "#FFFFFF"; //color input is white
        }
    }

    //border color
    document.getElementById("oborder_sel").disabled = false;
    document.getElementById("c_oborder").value = "#000000"; //black borders

    
    //set table color
    var trs = document.getElementsByTagName("tr");
    for(tr of trs){
        tr.style.backgroundColor = "white";
    }
    table.style.borderColor = "black";
}//colorDefault

function fontDefault(){
    document.getElementById("fheader_sel").selectedIndex = 0;
    document.getElementById("fdata_sel").selectedIndex = 0;

    //set table 
    var ths = document.getElementsByTagName("th");
    var tds = document.getElementsByTagName("td");
    for(let h = 0; h < ths.length; h++){
        ths[h].style.fontFamily = fonts[0];
    }
    for(let d = 0; d < tds.length; d++){
        tds[d].style.fontFamily = fonts[0];
    }
}//fontDefault

function sizeDefault(){
    document.getElementById("obt_range").value = 1;
    document.getElementById("obt_range_num").innerHTML = "1";
    
    document.getElementById("ibt_range").value = 1;
    document.getElementById("ibt_range_num").innerHTML = "1";

    document.getElementById("header_range").value = 50;
    document.getElementById("header_range_num").innerHTML = "50";

    document.getElementById("col_range").value = 50;
    document.getElementById("col_range_num").innerHTML = "50";

    document.getElementById("row_range").value = 50;
    document.getElementById("row_range_num").innerHTML = "50";

    if(!isEmpty){
        document.getElementById("hfont_range").value = 20;
        document.getElementById("hfont_range_num").innerHTML = "20";

        document.getElementById("dfont_range").value = 20;
        document.getElementById("dfont_range_num").innerHTML = "20";
    }

    //set table 
    var ths = document.getElementsByTagName("th");
    var tds = document.getElementsByTagName("td");
    //border size
    table.style.borderWidth = "1px";

    //height, width, borderWidth, and fontSize
    //NEEDS LIL TWEEKING
    for(let i = 0; i < ths.length; i++){
        ths[i].style.height = "50px";
        ths[i].style.width = "50px";
        ths[i].style.borderWidth = "1px";
        ths[i].style.fontSize = "20px";
    }
    for(let i = 0; i < tds.length; i++){
        tds[i].style.height = "50px";
        tds[i].style.width = "50px";
        tds[i].style.borderWidth = "1px";
        tds[i].style.fontSize = "20px";
    }
}//sizeDefault

function setRows(rows){
    var diff = 0;
    //delete row
    if(rows < rNum){ 
        diff = rNum - rows;
        
        for(let n = 0; n < diff; n++){
            var last = table.lastChild;
            last.remove();
        }
    }//delete row
    //add row
    else{ 
        diff = rows - rNum;
        for(let n = 0; n < diff; n++){
            var tr = document.createElement("tr");
            table.appendChild(tr);
            //add the last known number of columns to add row
            for(let m = 0; m < cNum; m++){
                var td = document.createElement("td");
                tr.appendChild(td);
            }
        }
    }//add row

    rNum = rows;
    
    setRCColor();
}//setRows

function setCols(cols){
    var diff = 0;
    var trs = document.getElementsByTagName("tr");

    //delete column
    if(cols < cNum){
        diff = cNum - cols;
        for(let i = 0; i < trs.length; i++){
            for(let j = 0; j < diff; j++){
                trs[i].lastChild.remove();
            }
        }
        //deletes last header
        if(!isEmpty){
            //delete from select
            var sel = document.getElementById("header_sel");
            sel.remove(headers.length - 1);

            //delete from array
            headers.pop();
        }
    }//delete column
    //add column
    else{
        diff = cols - cNum;
        for(let i = 0; i < trs.length; i++){
            for(let j = 0; j < diff; j++){
                if(i == 0){
                    var th = document.createElement("th");
                    trs[i].appendChild(th);
                }
                else{
                    var td = document.createElement("td");
                    trs[i].appendChild(td);
                }
            }//cols
        }//table rows
    }//add column

    cNum = cols;

    setRCColor();
}//setCols

function tableBorderCollapse(div, lbl){
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(lbl));
    div.appendChild(label);

    //toggle
    var toggle = document.createElement("label");
    toggle.setAttribute("id", "switch");
    //checkbox
    var inputCheck = document.createElement("input");
    inputCheck.type = "checkbox";
    inputCheck.setAttribute("id", "collapse_cb");
    inputCheck.checked = true;
    inputCheck.onchange = function(){
        if(inputCheck.checked){ table.style.borderCollapse = "collapse"; }
        else{ table.style.borderCollapse = "separate"; }
    }
    //span
    var span = document.createElement("span");
    span.setAttribute("id", "slider");
    //add to label
    toggle.appendChild(inputCheck);
    toggle.appendChild(span);

    //add to div
    div.appendChild(toggle);
    div.appendChild(document.createElement("br"));
}//tableBorderCollapse

function borderSelect(div, lbl, name){
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(lbl));
    div.appendChild(label);
    //label.style.marginInlineStart = "5%";

    //select
    var border_sel = document.createElement("select");
    border_sel.setAttribute("id", name + "_sel");
    //add options
    for(let b = 0; b < bStyles.length; b++){
        var opt = document.createElement("option");
        opt.appendChild(document.createTextNode(bStyles[b]));
        border_sel.appendChild(opt);
    }

    //append to div
    div.appendChild(border_sel);
    div.appendChild(document.createElement("br"));

    //events
    border_sel.onchange = function(){ setBorder(border_sel, name) };
}//borderSelect

function setBorder(sel, bType){
    if(bType == "outerb"){
        table.style.borderStyle = sel.value;
    }
    else if(bType == "innerb"){
        var tds = document.getElementsByTagName("td");
        for(let t = 0; t < tds.length; t++){
            tds[t].style.borderStyle = sel.value;
        } 
    }
    else if(bType == "headerb"){
        var ths = document.getElementsByTagName("th");
        for(let h = 0; h < ths.length; h++){
            ths[h].style.borderStyle = sel.value;
        }
    }
}//setBorder

function makeRadio(div, lbl, name){
    //radio
    var rad = document.createElement("input");
    rad.setAttribute("type", "radio");
    rad.setAttribute("id", name + "_rad");
    rad.value = name;
    rad.setAttribute("class", "colorinput");

    //label
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(lbl));
    label.setAttribute("for", name);

    //append to div
    div.appendChild(rad);
    div.appendChild(label);
    div.appendChild(document.createElement("br"));

    //event
    rad.onchange = function(){ radioSelected(rad.id) };
}//makeRadio

function radioSelected(id){
    var inputs = document.getElementsByClassName("colorinput");
    var sels = document.getElementsByClassName("color_sel");
    
    //exclude the last select for border color
    var sel_len = sels.length - 1;
    
    //disable all other options if radio is selected
    if(id.includes("all")){
        //disable color input
        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type == "color"){
                if(inputs[i].name == "c_bkgd" || inputs[i].id == "c_oborder"){
                    inputs[i].disabled = false;
                }
                else{
                    inputs[i].disabled = true;
                }
            }
            //uncheck radio
            if(inputs[i].type == "radio"){
                if(inputs[i].id != "all_rad"){
                    inputs[i].checked = false;
                }
            }
        }
        //disable select 
        for(let i = 0; i < sel_len; i++){
            if(sels[i].id != "bkgd_sel"){
                sels[i].disabled = true;
            }
            else{ //if was previously disabled
                sels[i].disabled = false;
            }
        }
    }//all

    else if(id.includes("striped")){
        //disable color input
        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type == "color"){
                if(inputs[i].name == "c_even" || inputs[i].name == "c_odd" || inputs[i].id == "c_oborder"){
                    inputs[i].disabled = false;
                }
                else{
                    inputs[i].disabled = true;
                }
            }
            //uncheck radio
            if(inputs[i].type == "radio"){
                if(inputs[i].id != "striped_rad"){
                    inputs[i].checked = false;
                }
            }
        }
        //disable select 
        for(let i = 0; i < sel_len; i++){
            if(sels[i].id != "even_sel" && sels[i].id != "odd_sel"){
                sels[i].disabled = true;
            }
            else{ //if was previously disabled
                sels[i].disabled = false;
            }
        }
    }//striped

    else if(id.includes("custom")){
        //disable color input
        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type == "color"){
                if(inputs[i].id.includes("th") || inputs[i].id.includes("td") || inputs[i].id.includes("cust")
                    || inputs[i].id == "c_oborder"){
                    inputs[i].disabled = false;
                }
                else{
                    inputs[i].disabled = true;
                }
            }
            //uncheck radio
            if(inputs[i].type == "radio"){
                if(inputs[i].id != "custom_rad"){
                    inputs[i].checked = false;
                }
            }
        }
        //disable select 
        for(let i = 0; i < sel_len; i++){
            if(sels[i].id.includes("th") || sels[i].id.includes("td") || sels[i].id.includes("cust")){
                sels[i].disabled = false;
            }
            else{ //disable what's not under the radio selection
                sels[i].disabled = true;
            }
        }
    }//custom

    //sets color of table cells if option was previously selected
    setRCColor();
}//radioSelected

function colorInput(div, lbl, name){
    //label
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(lbl));
    div.appendChild(label);
    label.style.marginInlineStart = "5%";

    //select
    var color_sel = document.createElement("select");
    color_sel.setAttribute("id", name + "_sel");
    color_sel.setAttribute("class", "color_sel");
    //add options
    for(let c = 0; c < colors.length; c++){
        var opt = document.createElement("option");
        opt.appendChild(document.createTextNode(colors[c]));
        color_sel.appendChild(opt);
    }
    
    //color picker
    var cinput = document.createElement("input");
    cinput.type = "color";
    cinput.id = "c_" + name;
    cinput.name = "c_" + name;
    cinput.value = "#FFFFFF";
    cinput.setAttribute("class", "colorinput");

    //append to div
    div.appendChild(color_sel);
    div.appendChild(document.createTextNode(" or "));
    div.appendChild(cinput);
    div.appendChild(document.createElement("br"));

    //events
    color_sel.onchange = function(){ colorToHex(color_sel, cinput) };
    cinput.oninput = function(){ setColor(cinput.id) };
}//colorInput

function colorToHex(sel, cinput){
    var idx = sel.selectedIndex;
    switch(idx){
        case 0: //black
            cinput.value = "#000000";
            break;
        case 1: //red
            cinput.value = "#FF0000";
            break;
        case 2: //orange
            cinput.value = "#FFA500";
            break;
        case 3: //yellow
            cinput.value = "#FFFF00";
            break;
        case 4: //green
            cinput.value = "#008000";
            break;
        case 5: //blue
            cinput.value = "#0000FF";
            break;
        case 6: //indigo
            cinput.value = "#4B0082";
            break;
        case 7: //violet
            cinput.value = "#EE82EE";
            break;
        case 8: //brown
            cinput.value = "#A52A2A";
            break;
        case 9: //white
            cinput.value = "#FFFFFF";
            break;
    }//switch

    //setcolor
    setColor(cinput.id);
}//colorToHex

function setRCColor(){
    //set color
    var all = document.getElementById("all_rad");
    var striped = document.getElementById("striped_rad");
    var custom = document.getElementById("custom_rad");

    if(all.checked){
        setColor("c_bkgd");
    }
    else if(striped.checked){
        setColor("c_even");
        setColor("c_odd");
    }
    else if(custom.checked){
        setColor("c_th");
        setColor("c_td");
        setColor("c_even_cust");
        setColor("c_odd_cust");
    }
}//setRCColor

function setColor(cinput){
    var cin = document.getElementById(cinput);
    var trs = document.getElementsByTagName("tr");

    if(cinput.includes("bkgd")){
        table.style.backgroundColor = cin.value;
        for(let i = 0; i < trs.length; i++){
            trs[i].style.backgroundColor = cin.value;
        }
    }
    else if(cinput == "c_even" || cinput == "c_odd_cust"){ //from 2nd row and every other row
        for(let i = 1; i < trs.length; i+=2){
            trs[i].style.backgroundColor = cin.value;
        }
    }
    else if(cinput == "c_even_cust"){
        for(let i = 2; i < trs.length; i+=2){
            trs[i].style.backgroundColor = cin.value;
        }
    }
    else if(cinput == "c_odd"){ //from 1st row and every other row
        for(let i = 0; i < trs.length; i+=2){
            trs[i].style.backgroundColor = cin.value;
        }
    }
    else if(cinput.includes("th")){ //table header
        trs[0].style.backgroundColor = cin.value;
    }
    else if(cinput.includes("td")){ //table data
        for(let i = 1; i < trs.length; i++){
            trs[i].style.backgroundColor = cin.value;
        }
    }
    else if(cinput.includes("oborder")){
        table.style.borderColor = cin.value;
    }
}//setColor

function fontSelect(div, lbl, name){
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(lbl));
    div.appendChild(label);

    //select
    var font_sel = document.createElement("select");
    font_sel.setAttribute("id", name + "_sel");
    //add options
    for(let f = 0; f < fonts.length; f++){
        var opt = document.createElement("option");
        opt.appendChild(document.createTextNode(fonts[f]));
        font_sel.appendChild(opt);
        opt.style.fontFamily = fonts[f];
    }

    //append to div
    div.appendChild(font_sel);
    div.appendChild(document.createElement("br"));

    //events
    font_sel.onchange = function(){ setFont(font_sel, name) };
}//fontSelect

function setFont(sel, type){
    if(type == "fheader"){
        var ths = document.getElementsByTagName("th");
        for(let h = 0; h < ths.length; h++){
            ths[h].style.fontFamily = sel.value;
        }
    }
    else if(type == "fdata"){
        var tds = document.getElementsByTagName("td");
        for(let t = 0; t < tds.length; t++){
            tds[t].style.fontFamily = sel.value;
        }
    }
}//setFont

function sizeRange(div, lbl, name, min, max){
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(lbl));
    label.setAttribute("for", name);

    //range
    var range = document.createElement("input");
    range.setAttribute("type", "range");
    range.setAttribute("id", name);
    range.name = name;
    range.min = min;
    range.max = max;

    //show value
    var num = document.createElement("label");
    num.setAttribute("id", name+"_num");

    //append to div
    div.appendChild(label);
    div.appendChild(range);
    div.appendChild(num);
    div.appendChild(document.createElement("br"));

    //event
    range.onchange = function(){ setSize(range, num) };
}//sizeRange

function setSize(range, lbl){
    //outer border
    if(range.id == "obt_range"){
        table.style.borderWidth = range.value + "px";
    }
    //inner borders
    else if(range.id == "ibt_range"){
        var ths = document.getElementsByTagName("th");
        var tds = document.getElementsByTagName("td");
        for(let i = 0; i < ths.length; i++){
            ths[i].style.borderWidth = range.value + "px";
        }
        for(let j = 0; j < tds.length; j++){
            tds[j].style.borderWidth = range.value + "px";
        }
    }
    //header row height
    else if(range.id == "header_range"){
        var trs = document.getElementsByTagName("tr");
        trs[0].style.height = range.value + "px";
    }
    //column width
    else if(range.id == "col_range"){
        var ths = document.getElementsByTagName("th");
        var tds = document.getElementsByTagName("td");
        for(let i = 0; i < ths.length; i++){
            ths[i].style.width = range.value + "px";
        }
        for(let j = 0; j < tds.length; j++){
            tds[j].style.width = range.value + "px";
        }
    }
    //data row height
    else if(range.id == "row_range"){
        var trs = document.getElementsByTagName("tr");
        for(let i = 1; i < trs.length; i++){
            trs[i].style.height = range.value + "px";
        }
    }
    //header font size
    else if(range.id == "hfont_range"){
        var ths = document.getElementsByTagName("th");
        for(let i = 0; i < ths.length; i++){
            ths[i].style.fontSize = range.value + "px";
        }
    }
    //data font size
    else if(range.id == "dfont_range"){
        var tds = document.getElementsByTagName("td");
        for(let i = 0; i < tds.length; i++){
            tds[i].style.fontSize = range.value + "px";
        }
    }

    //show size
    lbl.innerHTML = " " + range.value;
}//setSize

function switchEdit(){
    //clearing content
    setup_div.innerHTML = "";
    table.innerHTML = "";
    table.style.borderCollapse = "collapse";

    if(title.innerHTML == "EMPTY Table"){ makeFTable(); }
    else if(title.innerHTML == "Fill In Table"){ makeETable(); }
}//switchEdit

function printTable(){
    var body = document.body;
    //clone table
    var clone_table = table.cloneNode(true);
    //hide everything
    document.getElementsByTagName("h1")[0].style.display = "none";
    choose_div.style.display = "none";
    document.getElementById("switchBtn").style.display = "none";
    main.style.display = "none";

    body.appendChild(clone_table);
    body.style.width = "auto";
    body.style.height = "auto";

    window.print();

    console.log(body.lastChild);
    body.removeChild(body.lastChild);

    
    //show everything
    document.getElementsByTagName("h1")[0].style.display = "block";
    document.getElementById("switchBtn").style.display = "inline-block";
    main.style.display = "block";
}//viewTable

/* FILL IN YOUR OWN DATA */ 

function makeFTable(){
    //show-hide choices
    choose_div.style.display = "none";
    
    //headers, data, etc...
    main.style.display = "inline-block";

    title.innerHTML = "Fill In Table";

    addRC();

    //ADD HEADER FIRST
    var hdiv = document.createElement("div");
    hdiv.setAttribute("id", "header_div");
    var h3 = document.createElement("h3");
    h3.innerHTML = "Header";
    h3.style.textAlign = "left";
    h3.style.marginBottom = "1px";
    hdiv.appendChild(h3);

    inputText(hdiv, "header", "header");
    
    setup_div.appendChild(hdiv);


    //ADD DATA
    var ddiv = document.createElement("div");
    ddiv.setAttribute("id", "data_div");
    var h3d = document.createElement("h3");
    h3d.innerHTML = "Data";
    h3d.style.textAlign = "left";
    h3d.style.marginBottom = "1px";
    ddiv.appendChild(h3d);

    //select
    var select = document.createElement("select");
    select.setAttribute("id", "header_sel");
    ddiv.appendChild(select);

    inputText(ddiv, "data", "data");

    setup_div.appendChild(ddiv);
    
    //ADD STYLE
    isEmpty = false;
    style();
    
    defaultSettings();
}//makeFTable

function inputText(div, id, type){
    //create input
    var txt = document.createElement("input");
    txt.setAttribute("id", id+"_txt");
    txt.setAttribute("type", "text");
    txt.required = true;

    //add button
    var addBtn = document.createElement("button");
    addBtn.setAttribute("id", id+"_btn");
    addBtn.innerHTML = "ADD";

    //append all to the given divs
    div.appendChild(txt);
    div.appendChild(addBtn);  

    //event
    addBtn.onclick = function(){ addToTable(txt, type); };
    txt.addEventListener("keyup", function(event){ 
        //enter button pressed to submit text
        if(event.code === "Enter"){
            event.preventDefault();

            addToTable(txt, type);
        }
    });
}//inputText

function addToTable(input, type){
    var text = input.value;
    var select = document.getElementById("header_sel");

    //change focus to add more rows if table full
    /*if(isTableFull){
        var ri = document.getElementById("row_input");
        ri.onfocus = function(){ ri.style.backgroundColor = "gold" };
    }

    else{*/
        //header list item vs data list item
        if(type == "header"){
            //add to array
            headers.push(text);

            //add to table
            tableHeaderAdd(text);

            //add options to the select in data section
            var opt = document.createElement("option");
            opt.appendChild(document.createTextNode(text));
            select.appendChild(opt); 
        }
        else if(type == "data"){
            //get selected header
            var hd = select.value;

            //add to table with index number
            tableDataAdd(text, headers.indexOf(hd));
        }
    //}   
    
    //reset
    input.value = "";
}//addToTable

function tableHeaderAdd(header){
    //get list of table headers
    var ths = document.getElementsByTagName("th");
    var thd = null;

    //loop through all headers break after first empty one
    for(let t = 0; t < ths.length; t++){
        if(ths[t].innerHTML == ""){
            thd = ths[t];
            break;
        }
    }
    
    //add text to table header
    thd.innerHTML = header;

    //onclick to edit
    thd.onclick = function(){ tblEdit(this, header) };
    var n = headers.length - 1;
    thd.setAttribute("id", "th"+n);
}//tableHeaderAdd

function tableDataAdd(data, hn){
    var trs = document.getElementsByTagName("tr");
    var tds = null;
    var tda = null;

    //console.log(trs[1].childNodes);
    //look for table data in specified column for each row
    for(let r = 1; r < trs.length; r++){
        //all the table data for the first data row 
        tds = trs[r].childNodes;
        
        //check if empty if not go to next row
        if(tds[hn].innerHTML == ""){
            tda = tds[hn];
            break;
        }
    }

    //keep track
    tda.setAttribute("id", "td_"+data);
    tda.setAttribute("class", "td"+hn);

    //add text to table data
    tda.innerHTML = data;

    //onclick to edit or delete
    tda.onclick = function(){ tblEdit(this, data) };
/*
    //last row
    var lr = trs[trs.length - 1].childNodes;
    //last data cell
    var ld = lr[lr.length - 1];
    //check if table if full
    isTableFull = ld.innerHTML != "";*/
}//tableDataAdd

function tblEdit(dom, text){
    var id = dom.id;
    var input = null;
    var btn = null;
    var type = null;

    var sel = document.getElementById("header_sel");
    var opts = sel.options;

    //check if one is a table header or data
    if(id.includes("th")){
        type = "header";
        input = document.getElementById("header_txt");
        btn = document.getElementById("header_btn");
    }//th
    else{ 
        type = "data";
        //sel = document.getElementById("header_sel");
        input = document.getElementById("data_txt");
        btn = document.getElementById("data_btn");
    }//td

    //table cell in edit mode
    dom.style.borderColor = "gold";
    
    //change text
    input.value = text;
    btn.innerHTML = "EDIT";
    btn.onclick = function(){ 
        if(type == "header"){
            //set select to appropriate data
            for(let i = 0; i < opts.length; i++){
                if(opts[i].text == dom.innerHTML){
                    opts[i].text = input.value;
                }
            }
        }
        dom.innerHTML = input.value; 
        input.value = "";
        
        //change table cell back
        dom.style.borderColor = "black";

        //change button back
        btn.innerHTML = "ADD";
        btn.onclick = function(){ addToTable(input, type); };
    };
}//tblEdit

