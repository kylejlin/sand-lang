/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[6,8],$V1=[12,18],$V2=[2,3],$V3=[1,11],$V4=[2,11],$V5=[1,14],$V6=[1,20],$V7=[17,20],$V8=[7,9,14,32],$V9=[2,19],$Va=[1,26],$Vb=[12,17,20,22,27,30],$Vc=[1,34],$Vd=[2,24],$Ve=[1,35],$Vf=[1,60],$Vg=[1,77],$Vh=[1,76],$Vi=[1,71],$Vj=[1,70],$Vk=[1,73],$Vl=[1,74],$Vm=[20,30],$Vn=[7,9,12,14,15,17,20,23,27,30,32,38,42,43,44,45,46,47,48,49,50,51,52,53,54,55,57,58],$Vo=[15,17,43,44,45,46,47,48,49,50,51,52,53,54],$Vp=[2,78],$Vq=[15,17,43,44,45,46,47,48,49,51,52,53,54],$Vr=[2,77],$Vs=[1,94],$Vt=[1,96],$Vu=[1,90],$Vv=[1,91],$Vw=[1,92],$Vx=[1,93],$Vy=[1,95],$Vz=[1,97],$VA=[1,98],$VB=[1,99],$VC=[1,100],$VD=[1,101],$VE=[1,102],$VF=[1,103],$VG=[12,14,15,17,20,23,27,30,43,44,45,46,47,48,49,50,51,52,53,54],$VH=[12,14,15,17,20,22,23,27,28,30,43,44,45,46,47,48,49,50,51,52,53,54,61],$VI=[2,39],$VJ=[2,43],$VK=[2,41],$VL=[2,45],$VM=[2,38],$VN=[2,42],$VO=[2,40],$VP=[2,44],$VQ=[12,14,20,23,27,30,43,44,45,46],$VR=[12,14,15,17,20,23,27,30,43,44,45,46,47,48],$VS=[12,14,15,17,20,23,27,30,43,44,45,46,47,48,49,50],$VT=[12,14,15,17,20,23,27,30,43,44,45,46,47,48,49,50,51,52,53],$VU=[9,12,14,15,17,20,23,27,30,38,42,43,44,45,46,47,48,49,50,51,52,53,54,55,57,58],$VV=[9,12,14,15,17,20,23,27,30,38,43,44,45,46,47,48,49,50,51,52,53,54,55,57,58];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"classes":3,"pubClass":4,"optPrivClasses":5,"EOF":6,"pub":7,"class":8,"IDENTIFIER":9,"optTypeArgDefs":10,"optExtension":11,"{":12,"classBody":13,"}":14,"<":15,"typeArgDefs":16,">":17,"extends":18,"type":19,",":20,"typeArgs":21,"[":22,"]":23,":":24,"classItem":25,"optAccessModifier":26,";":27,"(":28,"optArgDefs":29,")":30,"compoundExpression":31,"prot":32,"argDefs":33,"expressionLackingRightDelimiter":34,"expressionIncludingRightDelimiter":35,"twoOrMoreExpressionsWhereTheLastLacksRightDelimiter":36,"twoOrMoreExpressionsWhereTheLastIncludesRightDelimiter":37,"if":38,"expression":39,"optElseExpression":40,"optElseIfExpression":41,"else":42,"||":43,"&&":44,"==":45,"!=":46,"<=":47,">=":48,"+":49,"-":50,"*":51,"/":52,"%":53,"**":54,"!":55,"functionCall":56,"NUMBER":57,"STRING":58,"assignableExpression":59,"optArgs":60,".":61,"args":62,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",7:"pub",8:"class",9:"IDENTIFIER",12:"{",14:"}",15:"<",17:">",18:"extends",20:",",22:"[",23:"]",24:":",27:";",28:"(",30:")",32:"prot",38:"if",42:"else",43:"||",44:"&&",45:"==",46:"!=",47:"<=",48:">=",49:"+",50:"-",51:"*",52:"/",53:"%",54:"**",55:"!",57:"NUMBER",58:"STRING",61:"."},
productions_: [0,[3,3],[4,8],[10,0],[10,3],[16,1],[16,3],[16,3],[16,5],[5,0],[5,8],[11,0],[11,2],[19,4],[19,1],[19,3],[19,4],[21,1],[21,3],[13,0],[13,2],[25,5],[25,8],[25,6],[26,0],[26,1],[26,1],[29,0],[29,1],[33,3],[33,5],[31,2],[31,3],[31,4],[31,3],[31,3],[31,4],[31,3],[36,3],[36,2],[36,3],[36,2],[37,3],[37,2],[37,3],[37,2],[35,4],[40,1],[40,3],[41,0],[41,5],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,3],[34,2],[34,2],[34,1],[34,1],[34,1],[34,1],[56,4],[59,1],[59,3],[59,3],[59,4],[59,4],[39,1],[39,1],[60,0],[60,1],[62,1],[62,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return { type: yy.NodeType.File, pubClass: $$[$0-2], privClasses: $$[$0-1], location: yy.camelCase(this._$) }; 
break;
case 2:
 this.$ = { type: yy.NodeType.Class, isPub: true, name: $$[$0-5], typeArgDefs: $$[$0-4], superClass: $$[$0-3], items: $$[$0-1], location: yy.camelCase(this._$) }; 
break;
case 3: case 9: case 19: case 27: case 31: case 49: case 79:
 this.$ = []; 
break;
case 4: case 35: case 37:
 this.$ = $$[$0-1]; 
break;
case 5:
 this.$ = [{ name: $$[$0], constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(this._$) }]; 
break;
case 6:
 this.$ = [{ name: $$[$0-2], constraint: { constraintType: yy.ConstraintType.Extends, superClass: $$[$0] }, location: yy.camelCase(this._$) }]; 
break;
case 7:
 this.$ = $$[$0-2].concat([{ name: $$[$0], constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(_$[$0]) }]); 
break;
case 8:
 this.$ = $$[$0-4].concat([{ name: $$[$0-2], constraint: { constraintType: yy.ConstraintType.Extends, superClass: $$[$0] }, location: yy.camelCase(yy.merge(_$[$0-2], _$[$0])) }]); 
break;
case 10:
 this.$ = $$[$0-7].concat([{ type: yy.NodeType.Class, isPub: false, name: $$[$0-5], typeArgDefs: $$[$0-4], superClass: $$[$0-3], items: $$[$0-1], location: yy.camelCase(yy.merge(_$[$0-6], _$[$0])) }]); 
break;
case 11: case 24:
 this.$ = null; 
break;
case 12:
 this.$ = $$[$0]; 
break;
case 13:
 this.$ = { name: $$[$0-3], args: $$[$0-1], location: yy.camelCase(this._$) }; 
break;
case 14:
 this.$ = { name: $$[$0], args: [], location: yy.camelCase(this._$) }; 
break;
case 15:
 this.$ = { name: "array", args: [$$[$0-2]], location: yy.camelCase(this._$) }; 
break;
case 16:
 this.$ = { name: "java.util.ArrayList", args: [yy.wrapPrimitiveIfNeeded($$[$0-3])], location: yy.camelCase(this._$) }; 
break;
case 17: case 81:
 this.$ = [$$[$0]]; 
break;
case 18: case 40: case 44: case 82:
 this.$ = $$[$0-2].concat([$$[$0]]); 
break;
case 20: case 41: case 45:
 this.$ = $$[$0-1].concat([$$[$0]]); 
break;
case 21:
 this.$ = { type: yy.NodeType.PropertyDeclaration, accessModifier: $$[$0-4], name: $$[$0-3], valueType: $$[$0-1], location: yy.camelCase(this._$) }; 
break;
case 22:
 this.$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $$[$0-7], name: $$[$0-6], args: $$[$0-4], returnType: $$[$0-1], body: $$[$0], location: yy.camelCase(this._$) }; 
break;
case 23:
 this.$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $$[$0-5], name: $$[$0-4], args: $$[$0-2], returnType: "void", body: $$[$0], location: yy.camelCase(this._$) }; 
break;
case 25:
 this.$ = "pub"; 
break;
case 26:
 this.$ = "prot"; 
break;
case 29:
 this.$ = [{ name: $$[$0-2], valueType: $$[$0], location: yy.camelCase(this._$) }]; 
break;
case 30:
 this.$ = $$[$0-4].concat([{ name: $$[$0-2], valueType: $$[$0], location: yy.camelCase(yy.merge(_$[$0-2], _$[$0])) }]); 
break;
case 32: case 34:
 this.$ = [$$[$0-1]]; 
break;
case 33:
 this.$ = [$$[$0-2]]; 
break;
case 36:
 this.$ = $$[$0-2]; 
break;
case 38: case 42:
 this.$ = [$$[$0-2], $$[$0]]; 
break;
case 39: case 43:
 this.$ = [$$[$0-1], $$[$0]]; 
break;
case 46:
 this.$ = { type: yy.NodeType.If, condition: $$[$0-2], body: $$[$0-1], alternatives: $$[$0], location: yy.camelCase(this._$) }; 
break;
case 48:
 this.$ = $$[$0-2].concat([{ type: yy.IfAlternativeType.Else, body: $$[$0], location: yy.camelCase(yy.merge(_$[$0-1], _$[$0])) }]); 
break;
case 50:
 this.$ = $$[$0-4].concat([{ type: yy.IfAlternativeType.ElseIf, condition: $$[$0-1], body: $$[$0], location: yy.camelCase(yy.merge(_$[$0-3], _$[$0])) }]); 
break;
case 51:
 this.$ = yy.binaryExpr("||", $$[$0-2], $$[$0], this._$); 
break;
case 52:
 this.$ = yy.binaryExpr("&&", $$[$0-2], $$[$0], this._$); 
break;
case 53:
 this.$ = yy.binaryExpr("==", $$[$0-2], $$[$0], this._$); 
break;
case 54:
 this.$ = yy.binaryExpr("!=", $$[$0-2], $$[$0], this._$); 
break;
case 55:
 this.$ = yy.binaryExpr("<", $$[$0-2], $$[$0], this._$); 
break;
case 56:
 this.$ = yy.binaryExpr("<=", $$[$0-2], $$[$0], this._$); 
break;
case 57:
 this.$ = yy.binaryExpr(">", $$[$0-2], $$[$0], this._$); 
break;
case 58:
 this.$ = yy.binaryExpr(">=", $$[$0-2], $$[$0], this._$); 
break;
case 59:
 this.$ = yy.binaryExpr("+", $$[$0-2], $$[$0], this._$); 
break;
case 60:
 this.$ = yy.binaryExpr("-", $$[$0-2], $$[$0], this._$); 
break;
case 61:
 this.$ = yy.binaryExpr("*", $$[$0-2], $$[$0], this._$); 
break;
case 62:
 this.$ = yy.binaryExpr("/", $$[$0-2], $$[$0], this._$); 
break;
case 63:
 this.$ = yy.binaryExpr("%", $$[$0-2], $$[$0], this._$); 
break;
case 64:
 this.$ = yy.binaryExpr("**", $$[$0-2], $$[$0], this._$); 
break;
case 65:
 this.$ = yy.unaryExpr("!", $$[$0], this._$); 
break;
case 66:
 this.$ = yy.unaryExpr("-", $$[$0], this._$); 
break;
case 68:
 this.$ = { type: yy.NodeType.NumberLiteral, value: yytext, location: yy.camelCase(this._$) }; 
break;
case 69:
 this.$ = { type: yy.NodeType.StringLiteral, value: yytext, location: yy.camelCase(this._$) }; 
break;
case 71:
 this.$ = { type: yy.NodeType.FunctionCall, callee: $$[$0-3], args: $$[$0-1], location: yy.camelCase(this._$) }; 
break;
case 72:
 this.$ = { type: yy.NodeType.Identifier, value: yytext, location: yy.camelCase(this._$) }; 
break;
case 73: case 74:
 this.$ = yy.binaryExpr(".", $$[$0-2], $$[$0], this._$); 
break;
case 75: case 76:
 this.$ = yy.binaryExpr("[", $$[$0-3], $$[$0-1], this._$); 
break;
}
},
table: [{3:1,4:2,7:[1,3]},{1:[3]},o($V0,[2,9],{5:4}),{8:[1,5]},{6:[1,6],8:[1,7]},{9:[1,8]},{1:[2,1]},{9:[1,9]},o($V1,$V2,{10:10,15:$V3}),o($V1,$V2,{10:12,15:$V3}),{11:13,12:$V4,18:$V5},{9:[1,16],16:15},{11:17,12:$V4,18:$V5},{12:[1,18]},{9:$V6,19:19},{17:[1,21],20:[1,22]},o($V7,[2,5],{18:[1,23]}),{12:[1,24]},o($V8,$V9,{13:25}),{12:[2,12],22:$Va},o($Vb,[2,14],{15:[1,27]}),o($V1,[2,4]),{9:[1,28]},{9:$V6,19:29},o($V8,$V9,{13:30}),{7:$Vc,9:$Vd,14:[1,31],25:32,26:33,32:$Ve},{23:[1,36],24:[1,37]},{9:$V6,19:39,21:38},o($V7,[2,7],{18:[1,40]}),o($V7,[2,6],{22:$Va}),{7:$Vc,9:$Vd,14:[1,41],25:32,26:33,32:$Ve},o($V0,[2,2]),o($V8,[2,20]),{9:[1,42]},{9:[2,25]},{9:[2,26]},o($Vb,[2,15]),{23:[1,43]},{17:[1,44],20:[1,45]},o($V7,[2,17],{22:$Va}),{9:$V6,19:46},o($V0,[2,10]),{24:[1,47],28:[1,48]},o($Vb,[2,16]),o($Vb,[2,13]),{9:$V6,19:49},o($V7,[2,8],{22:$Va}),{9:$V6,19:50},{9:[1,53],29:51,30:[2,27],33:52},o($V7,[2,18],{22:$Va}),{22:$Va,27:[1,54]},{30:[1,55]},{20:[1,56],30:[2,28]},{24:[1,57]},o($V8,[2,21]),{12:$Vf,24:[1,58],31:59},{9:[1,61]},{9:$V6,19:62},{9:$V6,19:63},o($V8,[2,23]),{9:$Vg,14:[1,64],34:65,35:66,36:67,37:68,38:$Vh,39:69,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{24:[1,78]},o($Vm,[2,29],{22:$Va}),{12:$Vf,22:$Va,31:79},o($Vn,[2,31]),o($Vo,$Vp,{14:[1,80],27:[1,81]}),o($Vq,$Vr,{39:69,56:72,59:75,34:83,35:84,9:$Vg,14:[1,82],38:$Vh,50:$Vi,55:$Vj,57:$Vk,58:$Vl}),{14:[1,85],27:[1,86]},{9:$Vg,14:[1,87],34:88,35:89,38:$Vh,39:69,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{15:$Vs,17:$Vt,43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF},{9:$Vg,34:106,35:105,38:$Vh,39:104,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:107,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},o($VG,[2,67],{22:[1,109],61:[1,108]}),o($VG,[2,68]),o($VG,[2,69]),o($VG,[2,70],{22:[1,112],28:[1,110],61:[1,111]}),{9:$Vg,34:106,35:105,38:$Vh,39:113,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},o($VH,[2,72]),{9:$V6,19:114},o($V8,[2,22]),o($Vn,[2,32]),{9:$Vg,14:[1,115],34:116,35:117,38:$Vh,39:69,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},o($Vn,[2,34]),o($Vo,$Vp,{14:$VI,27:$VI}),o($Vq,$Vr,{9:$VJ,14:$VJ,38:$VJ,50:$VJ,55:$VJ,57:$VJ,58:$VJ}),o($Vn,[2,35]),{9:$Vg,14:[1,118],34:119,35:120,38:$Vh,39:69,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},o($Vn,[2,37]),o($Vo,$Vp,{14:$VK,27:$VK}),o($Vq,$Vr,{9:$VL,14:$VL,38:$VL,50:$VL,55:$VL,57:$VL,58:$VL}),{9:$Vg,34:106,35:105,38:$Vh,39:121,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:122,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:123,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:124,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:125,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:126,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:127,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:128,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:129,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:130,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:131,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:132,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:133,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,34:106,35:105,38:$Vh,39:134,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},o($VG,[2,65]),o($VG,$Vr),o($VG,$Vp),o($VG,[2,66]),{9:[1,135]},{9:$Vg,34:106,35:105,38:$Vh,39:136,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{9:$Vg,30:[2,79],34:106,35:105,38:$Vh,39:139,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75,60:137,62:138},{9:[1,140]},{9:$Vg,34:106,35:105,38:$Vh,39:141,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{12:$Vf,15:$Vs,17:$Vt,31:142,43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF},o($Vm,[2,30],{22:$Va}),o($Vn,[2,33]),o($Vo,$Vp,{14:$VM,27:$VM}),o($Vq,$Vr,{9:$VN,14:$VN,38:$VN,50:$VN,55:$VN,57:$VN,58:$VN}),o($Vn,[2,36]),o($Vo,$Vp,{14:$VO,27:$VO}),o($Vq,$Vr,{9:$VP,14:$VP,38:$VP,50:$VP,55:$VP,57:$VP,58:$VP}),o([12,14,20,23,27,30,43],[2,51],{15:$Vs,17:$Vt,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o([12,14,20,23,27,30,43,44],[2,52],{15:$Vs,17:$Vt,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VQ,[2,53],{15:$Vs,17:$Vt,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VQ,[2,54],{15:$Vs,17:$Vt,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VR,[2,55],{49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VR,[2,56],{49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VR,[2,57],{49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VR,[2,58],{49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VS,[2,59],{51:$VC,52:$VD,53:$VE,54:$VF}),o($VS,[2,60],{51:$VC,52:$VD,53:$VE,54:$VF}),o($VT,[2,61],{54:$VF}),o($VT,[2,62],{54:$VF}),o($VT,[2,63],{54:$VF}),o($VT,[2,64],{54:$VF}),o($VH,[2,74]),{15:$Vs,17:$Vt,23:[1,143],43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF},{30:[1,144]},{20:[1,145],30:[2,80]},o($Vm,[2,81],{15:$Vs,17:$Vt,43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),o($VH,[2,73]),{15:$Vs,17:$Vt,23:[1,146],43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF},o($VU,[2,49],{40:147,41:148}),o($VH,[2,76]),o([12,14,15,17,20,22,23,27,30,43,44,45,46,47,48,49,50,51,52,53,54,61],[2,71]),{9:$Vg,34:106,35:105,38:$Vh,39:149,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},o($VH,[2,75]),o($VV,[2,46]),o($VV,[2,47],{42:[1,150]}),o($Vm,[2,82],{15:$Vs,17:$Vt,43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF}),{12:$Vf,31:151,38:[1,152]},o($VV,[2,48]),{9:$Vg,34:106,35:105,38:$Vh,39:153,50:$Vi,55:$Vj,56:72,57:$Vk,58:$Vl,59:75},{12:$Vf,15:$Vs,17:$Vt,31:154,43:$Vu,44:$Vv,45:$Vw,46:$Vx,47:$Vy,48:$Vz,49:$VA,50:$VB,51:$VC,52:$VD,53:$VE,54:$VF},o($VU,[2,50])],
defaultActions: {6:[2,1],34:[2,25],35:[2,26]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return "pub"
break;
case 2:return "prot"
break;
case 3:return "class"
break;
case 4:return "extends"
break;
case 5:return "if"
break;
case 6:return "else"
break;
case 7:return "return"
break;
case 8:return "NUMBER"
break;
case 9:return "STRING"
break;
case 10:return "IDENTIFIER"
break;
case 11:return "**"
break;
case 12:return "*"
break;
case 13:return "/"
break;
case 14:return "%"
break;
case 15:return "-"
break;
case 16:return "+"
break;
case 17:return "=="
break;
case 18:return "!="
break;
case 19:return "<"
break;
case 20:return "<="
break;
case 21:return ">"
break;
case 22:return ">="
break;
case 23:return "!"
break;
case 24:return "&&"
break;
case 25:return "||"
break;
case 26:return "."
break;
case 27:return "["
break;
case 28:return "]"
break;
case 29:return "("
break;
case 30:return ")"
break;
case 31:return "{"
break;
case 32:return "}"
break;
case 33:return ":"
break;
case 34:return ","
break;
case 35:return ";"
break;
case 36:return "EOF"
break;
case 37:return "INVALID"
break;
}
},
rules: [/^(?:\s+)/,/^(?:pub\b)/,/^(?:prot\b)/,/^(?:class\b)/,/^(?:extends\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:return\b)/,/^(?:-?\d+(\.\d+)?(e?[1-9]\d*)?\b)/,/^(?:"(\\(u[0-9a-fA-F]{4}|[\\"nt])|[^\\"])*")/,/^(?:[_a-zA-Z]\w*)/,/^(?:\*\*)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:-)/,/^(?:\+)/,/^(?:==)/,/^(?:!=)/,/^(?:<)/,/^(?:<=)/,/^(?:>)/,/^(?:>=)/,/^(?:!)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:\.)/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?::)/,/^(?:,)/,/^(?:;)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}