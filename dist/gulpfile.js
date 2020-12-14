"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("del")),n=e(require("gulp")),r=e(require("path")),a=e(require("commander")),s=e(require("single-line-log")),i=e(require("gulp-load-plugins")),p=e(require("vue-template-compiler")),o=e(require("preprocess")),c=e(require("fs-extra")),l=e(require("chokidar")),u=e(require("strip-json-comments")),g=e(require("vinyl")),f=e(require("gulp-strip-comments"));const{program:h}=a;h.option("--scope <type>","运行目录",process.cwd()).option("--plugin","插件模式").option("--type <type>","解耦包类型(哪种小程序)","weixin").option("--native","原生模式"),h.parse(process.argv);const m={weixin:{html:"wxml",css:"wxss",globalObject:"wx",mainMpPath:"mainWeixinMpPath",directivePrefix:"wx:",projectConfig:"project.config.json"},baidu:{html:"swan",css:"css",globalObject:"swan",mainMpPath:"mainBaiduMpPath",directivePrefix:"s-",projectConfig:"project.swan.json"},toutiao:{html:"ttml",css:"ttss",globalObject:"tt",mainMpPath:"mainToutiaoMpPath",directivePrefix:"tt:",projectConfig:"project.config.json"},alipay:{html:"axml",css:"acss",globalObject:"my",mainMpPath:"mainAlipayMpPath",directivePrefix:"a:",projectConfig:"mini.project.json"}},d=m[h.type];if(!d)throw Error("小程序类型错");process.env.PACK_TYPE=h.type;const P=h.scope,b=function(){return require.apply(null,arguments)}(r.resolve(P,"./projectToSubPackageConfig")),v=b.sourceCodePath||"src",y=b.wxResourcePath||`${v}/${d.globalObject}resource`,w=b.wxResourceAlias||"@wxResource",j=RegExp(w+"\\/","g"),k=b.uniRequireApiName||"__uniRequireWx",x=RegExp(k+"\\(([a-zA-Z.\\/\"'@\\d-_]+)\\)","g"),$=b.uniImportWxssApiName||"__uniWxss",S=RegExp(`(}|^|\\s|;)${$}\\s*{([^{}]+)}`,"g"),O=b.projectConfigPath||"";let _="dev";"production"===process.env.NODE_ENV&&(_="build");const E="dist/"+_+"/mp-"+h.type;let C="dist/"+_+`/mp-${h.type}-pack`;h.plugin&&(C="dist/"+_+`/mp-${h.type}-pack-plugin`);var A={pluginProcessFileTypes:b.pluginProcessFileTypes||["js","json","wxml","ttml","ttss","swan","css","html","wxss","htm","wxs","sjs","acss","axml"],currentNamespace:d,program:h,cwd:P,projectToSubPackageConfig:b,wxResourcePath:y,wxResourceAlias:w,regExpWxResources:j,uniRequireApiName:k,regExpUniRequire:x,uniImportWxssApiName:$,regExpUniImportWxss:S,configWxResourceKey:b.configWxResourceKey||"wxResource",env:_,base:E,target:C,basePath:r.resolve(P,E),subModePath:r.resolve(P,C,b.subPackagePath),targetPath:r.resolve(P,C),packIsSubpackage:{mode:!1},mpTypeNamespace:m,sourceCodePath:v,projectConfigPath:O};let N;const R=s.stdout;var M={tryAgain:async function(e){return new Promise(async t=>{setTimeout(async()=>{t(await e())},100)})},getLevelPath:function(e){return Array(e).fill("../").join("")},getLevel:function(e){return e.split(/[\\/]/).length-1},writeLastLine:function(e){R(e),clearTimeout(N),N=setTimeout(()=>{R("解耦构建，正在监听中......(此过程如果出现权限问题，请使用管理员权限运行)")},300)},deepFind:function e(t,n,r,a){n&&(n(t,r,a),t.childNodes?t.childNodes.forEach((t,r,a)=>{e(t,n,r,a)}):t.children&&t.children.forEach((t,r,a)=>{e(t,n,r,a)}))}};const{basePath:T}=A,{tryAgain:L}=M;n.task("clean:base",(async function e(n){try{await t([T+"/**/*"],{force:!0})}catch(t){return void await L(async()=>{await e(n)})}n()}));const{subModePath:B}=A,{tryAgain:q}=M;n.task("clean:subModePath",(async function e(n){try{await t([B+"/**/*"],{force:!0})}catch(t){return void await q(async()=>{await e(n)})}n()}));const{targetPath:J}=A,{tryAgain:F}=M;n.task("clean:previewDist",(async function e(n){try{await t([J+"/**/*"],{force:!0})}catch(t){return void await F(async()=>{await e(n)})}n()}));const{compile:W}=p;var I=class{constructor(e){this.topNode={children:[]},this.init(e)}init(e){this.topNode=W(`<div>${e}</div>`).ast}getAttr(e,t){return e.attrsMap&&e.attrsMap[t]||""}setAttr(e,t,n){if(!e.attrsMap)return"";e.attrsMap[t]=n}render(e=this.topNode.children,t=""){return e.reduce((e,t)=>{if(t.removed)return e;if(1===t.type&&!t.tag)return e;if(3===t.type||2===t.type)return e+=this.writeText(t);const{tag:n,attrsMap:r,children:a=[]}=t;return e+=this.writeOpenTag(n,r),e+=this.render(a),e+=this.writeCloseTag(n)},t)}writeOpenTag(e,t){if(t){const n=Object.keys(t).map(e=>t[e].indexOf('"')>-1&&0>t[e].indexOf("'")?`${e}='${t[e]}'`:`${e}="${t[e]}"`);return`<${e}${n.length>0?" "+n.join(" "):""}>`}return`<${e}>`}writeText(e){return e.text}writeCloseTag(e){return`</${e}>`}};const{currentNamespace:U,mpTypeNamespace:K}=A,{deepFind:D}=M,H=Object.keys(K).map(e=>K[e].directivePrefix),Y=Object.keys(K).map(e=>K[e].html),z=RegExp(`^(${H.join("|")})`),V=RegExp(`\\.(${Y.join("|")})$`,"i");var Z=function(e,t){if(t.relative.match(V)){const t=new I(e);return D(t.topNode,e=>{if(!e.tag||3===e.type)return;const n=t.getAttr(e,"class");"toutiao"===process.env.PACK_TYPE&&n&&!n.match(/(^\s|(\s$))/)&&t.setAttr(e,"class",n+" ");const r=t.getAttr(e,"catchTap");"toutiao"===process.env.PACK_TYPE&&r&&!t.getAttr(e,"bindTap")&&t.setAttr(e,"bindTap",r);const a=t.getAttr(e,"src");e.tag.match(/^(include|import)$/)&&a&&t.setAttr(e,"src",a.replace(V,"."+U.html)),e.attrsMap&&Object.keys(e.attrsMap).forEach(t=>{if(t.match(z)){const n=t.replace(z,U.directivePrefix);e.attrsMap[n]=e.attrsMap[t],n!==t&&delete e.attrsMap[t]}})}),t.render()}return e};const{currentNamespace:G,mpTypeNamespace:Q}=A,X=Object.keys(Q).map(e=>Q[e].css),ee=RegExp(`\\.(${X.join("|")})$`,"i");var te=function(e,{relative:t}){return t.match(ee)&&(e=e.replace(/@import\s*['"](\S+)['"]/g,(function(e,t){return`@import '${t.replace(ee,"."+G.css)}'`}))),e};var ne=function(e,{relative:t}){return"toutiao"===process.env.PACK_TYPE&&t.match(/^\/app\.js$/i)?"\nif (!Promise.prototype.finally) {\n    Promise.prototype.finally = function (callback) {\n        let P = this.constructor;\n        return this.then(\n            value  => P.resolve(callback()).then(() => value),\n            reason => P.resolve(callback()).then(() => { throw reason })\n        );\n    };\n}\n;\n"+e:e};const{preprocess:re}=o;var ae=function(e,{relative:t}){if(t.match(/\.js$/i))try{return re(e,process.env,{type:"js"})}catch(t){return console.log("js条件编译出错"),console.log(t),e}return e};const{currentNamespace:se}=A,{preprocess:ie}=o;var pe=function(e,{relative:t}){if(t.match(RegExp(`.${se.css}$`,"i")))try{return ie(e,process.env,{type:"css"})}catch(t){return console.log(se.css+"条件编译出错"),console.log(t),e}return e};const{currentNamespace:oe}=A,{preprocess:ce}=o;var le=function(e,{relative:t}){if(t.match(RegExp(`.${oe.html}$`,"i")))try{return ce(e,process.env,{type:"html"})}catch(t){return console.log(oe.html+"条件编译出错"),console.log(t),e}return e};const{mpTypeNamespace:ue,currentNamespace:ge}=A,fe=(process,new Set(Object.keys(ue).map(e=>ue[e].globalObject)));var he={mixinsEnvCode:function(e){let t="";return fe.forEach(e=>{ge.globalObject!==e&&(t+=`var ${e} = ${ge.globalObject};\n`)}),t}};const{mixinsEnvCode:me}=he;var de={htmlMixinPlugin:Z,cssMixinPlugin:te,polyfillPlugin:ne,jsPreProcessPlugin:ae,cssPreProcessPlugin:pe,htmlPreProcessPlugin:le,jsMixinPlugin:function(e,{relative:t}){return t.match(/\.js$/i)?me()+e:e}};const{projectToSubPackageConfig:Pe,targetPath:be}=A,ve=r;(!Pe.plugins||!Pe.plugins instanceof Array)&&(Pe.plugins=[]);var ye={runPlugins:function(e){return function(t){const{plugins:n}=Pe;if(n&&!(!n instanceof Array))return n.reduce((t,n)=>{if("string"==typeof n&&(n=de[n]),"function"!=typeof n)return t;const r=ve.resolve(e,this.file.relative),a={relative:r.replace(RegExp("^"+be.replace(/\\/g,"\\\\")),"").replace(/\\/g,"/"),absolute:r};this.removeAfterAdd=function(e){!function(e){c.existsSync(e)&&c.removeSync(e);const t=l.watch(e);t.on("add",(function(){c.removeSync(e),t.close()}))}(e=e||r)};const s=n.call(this,t,a,de);return null==s?t:s},t)}}};const we=i(),{cwd:je,projectToSubPackageConfig:ke,target:xe,env:$e,pluginProcessFileTypes:Se,sourceCodePath:Oe}=A,{writeLastLine:_e}=M,{runPlugins:Ee}=ye;n.task("watch:pluginJson",(function(){const e=we.filter(Se.map(e=>"**/*."+e),{restore:!0});return n.src(Oe+"/plugin.json",{allowEmpty:!0,cwd:je}).pipe(we.if("dev"===$e,we.watch(Oe+"/plugin.json",{cwd:je},(function(e){_e("处理"+e.relative+"......")})))).pipe(e).pipe(we.replace(/[\s\S]*/,Ee(r.resolve(je,xe+"/"+ke.subPackagePath)),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(xe+"/"+ke.subPackagePath,{cwd:je}))}));const Ce=i(),{cwd:Ae,target:Ne,env:Re,targetPath:Me,pluginProcessFileTypes:Te,currentNamespace:Le,projectConfigPath:Be}=A,{writeLastLine:qe}=M,{runPlugins:Je}=ye;n.task("watch:projectConfigJson",(function(){const e=Ce.filter(Te.map(e=>"**/*."+e),{restore:!0});return n.src(`${Be?Be+"/":""}${Le.projectConfig}`,{allowEmpty:!0,cwd:Ae}).pipe(Ce.if("dev"===Re,Ce.watch(`${Be?Be+"/":""}${Le.projectConfig}`,{cwd:Ae},(function(e){qe("处理"+e.relative+"......")})))).pipe(e).pipe(Ce.replace(/[\s\S]*/,Je(Me),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(Ne,{cwd:Ae}))}));const{runPlugins:Fe}=ye,{program:We,cwd:Ie,projectToSubPackageConfig:Ue,subModePath:Ke,targetPath:De,packIsSubpackage:He,currentNamespace:Ye,target:ze}=A;var Ve=function(){if(We.plugin)return;const e=r.resolve(Ie,Ue[Ye.mainMpPath]+"/app.js");if(c.existsSync(e)){const t=c.readFileSync(e,"utf8");let n=`./${Ue.subPackagePath}/`,a="app.js";Ke===De&&(a="uni-bootstrap.js");let s=`require('${n}${a}');\n`;(He.mode||We.plugin)&&(s="");const i=new g({cwd:Ie,base:r.resolve(Ie,Ue[Ye.mainMpPath]),path:e});c.outputFileSync(De+"/"+i.relative,Fe(r.resolve(Ie,ze+(We.plugin?"/miniprogram":""))).call({file:i},s+t))}};const Ze=i(),{program:Ge,cwd:Qe,projectToSubPackageConfig:Xe,configWxResourceKey:et,base:tt,packIsSubpackage:nt,currentNamespace:rt,sourceCodePath:at}=A,{writeLastLine:st}=M;var it=function(e){return st("处理app.json......"),Ze.replace(/[\s\S]+/,(function(t){if(Ge.plugin&&"mainAppJson"===e)return t;nt.mode=!1;let n,a,s,i={};({pagesJson(){try{n=JSON.parse(u(t))}catch(e){n={}}},baseAppJson(){try{a=JSON.parse(t)}catch(e){a={}}},mainAppJson(){try{s=JSON.parse(t)}catch(e){s={}}}})[e]();try{n||(n=JSON.parse(u(c.readFileSync(r.resolve(Qe,at+"/pages.json"),"utf8"))))}catch(e){n={}}try{a||(a=JSON.parse(c.readFileSync(r.resolve(Qe,tt+"/app.json"),"utf8")))}catch(e){a={}}try{s||(s=JSON.parse(c.readFileSync(r.resolve(Qe,Xe[rt.mainMpPath]+"/app.json"),"utf8")))}catch(e){s={}}function p(e){return Xe.subPackagePath+(Xe.subPackagePath?"/":"")+e}if(s.subpackages&&!s.subPackages&&(s.subPackages=s.subpackages),s.subPackages){let e=s.subPackages.find(e=>e.root===Xe.subPackagePath);if(e){nt.mode=!0;let t=[...n[et]&&n[et].pages||[],...a.pages||[]];return a.subPackages&&a.subPackages.forEach(e=>{t=[...t,...(e.pages||[]).map(t=>e.root+(e.root?"/":"")+t)]}),n[et]&&n[et].subPackages&&n[et].subPackages.forEach(e=>{t=[...t,...(e.pages||[]).map(t=>e.root+(e.root?"/":"")+t)]}),e.pages=t,Ve.call(this),delete a.pages,delete a.subPackages,JSON.stringify({...a,...s},null,2)}}a.pages&&a.pages.forEach((e,t)=>{a.pages[t]=p(e)}),a.subPackages&&a.subPackages.forEach(e=>{e.root=p(e.root)}),n[et]&&(n[et].pages&&n[et].pages.forEach((e,t)=>{n[et].pages[t]=p(e)}),n[et].subPackages&&n[et].subPackages.forEach(e=>{e.root=p(e.root)})),a.tabBar&&a.tabBar.list&&a.tabBar.list.forEach(({pagePath:e,iconPath:t,selectedIconPath:n,...r},s)=>{a.tabBar.list[s]={pagePath:e?p(e):"",iconPath:t?p(t):"",selectedIconPath:n?p(n):"",...r}}),i={...a,...s},i.pages=Array.from(new Set([...n.indexPage?[p(n.indexPage)]:[],...s.pages||[],...a.pages||[],...n[et]&&n[et].pages||[]]));let o=[],l={},g={};function f(e){e.forEach(e=>{l[e.root]=l[e.root]?Array.from(new Set([...l[e.root],...e.pages])):e.pages,e.name&&(g[e.root]=e.name)})}f(n[et]&&n[et].subPackages||[]),f(a.subPackages||[]),f(s.subPackages||[]);for(let e in l){const t={root:e,pages:l[e]};g[e]&&(t.name=g[e]),o.push(t)}if(i.subPackages=[...o],a.usingComponents){for(let e in a.usingComponents)a.usingComponents[e]="/"+Xe.subPackagePath+a.usingComponents[e];i.usingComponents={...i.usingComponents||{},...a.usingComponents}}return Ve.call(this),"toutiao"===Ge.type&&i.subPackages&&(i.subPackages.forEach(e=>{e.pages.forEach(t=>{i.pages.push((e.root+"/"+t).replace(/\/\//g,"/"))})}),delete i.subPackages),JSON.stringify(i,null,2)}),{skipBinary:!1})};const pt=i(),{cwd:ot,target:ct,env:lt,targetPath:ut,pluginProcessFileTypes:gt,sourceCodePath:ft}=A,{writeLastLine:ht}=M,{runPlugins:mt}=ye;n.task("watch:pagesJson",(function(){const e=pt.filter(gt.map(e=>"**/*."+e),{restore:!0});return n.src(ft+"/pages.json",{allowEmpty:!0,cwd:ot}).pipe(pt.if("dev"===lt,pt.watch(ft+"/pages.json",{cwd:ot},(function(e){ht("处理"+e.relative+"......")})))).pipe(it("pagesJson")).pipe(pt.rename("app.json")).pipe(e).pipe(pt.replace(/[\s\S]*/,mt(ut),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(ct,{cwd:ot}))}));const dt=i(),{cwd:Pt,target:bt,env:vt,base:yt,targetPath:wt,pluginProcessFileTypes:jt}=A,{writeLastLine:kt}=M,{runPlugins:xt}=ye;n.task("watch:baseAppJson",(function(){const e=dt.filter(jt.map(e=>`${yt}/**/*.${e}`),{restore:!0});return n.src(yt+"/app.json",{allowEmpty:!0,cwd:Pt}).pipe(dt.if("dev"===vt,dt.watch(yt+"/app.json",{cwd:Pt},(function(e){kt("处理"+e.relative+"......")})))).pipe(it("baseAppJson")).pipe(e).pipe(dt.replace(/[\s\S]*/,xt(wt),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(bt,{cwd:Pt}))}));const $t=i(),{cwd:St,target:Ot,env:_t,projectToSubPackageConfig:Et,program:Ct,currentNamespace:At,pluginProcessFileTypes:Nt}=A,{writeLastLine:Rt}=M,{runPlugins:Mt}=ye;n.task("watch:mainAppJson",(function(){const e=Et[At.mainMpPath],t=$t.filter(Nt.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src(e+"/app.json",{allowEmpty:!0,cwd:St}).pipe($t.if("dev"===_t,$t.watch(e+"/app.json",{cwd:St},(function(e){Rt("处理"+e.relative+"......")})))).pipe(it("mainAppJson")).pipe(t).pipe($t.replace(/[\s\S]*/,Mt(r.resolve(St,Ot+(Ct.plugin?"/miniprogram":""))),{skipBinary:!1})).pipe(t.restore).pipe(n.dest(Ot+(Ct.plugin?"/miniprogram":""),{cwd:St}))}));const Tt=i(),{cwd:Lt,target:Bt,env:qt,projectToSubPackageConfig:Jt,program:Ft,basePath:Wt,currentNamespace:It,mpTypeNamespace:Ut,pluginProcessFileTypes:Kt}=A,{writeLastLine:Dt}=M,{runPlugins:Ht}=ye;n.task("watch:topMode-mainAppJsAndAppWxss",(function(){let e=Jt[It.mainMpPath];const t=Object.keys(Ut).map(t=>`${e}/app.${Ut[t].css}`),a=Tt.filter([...t],{restore:!0}),s=Tt.filter([e+"/app.js"],{restore:!0}),i=Tt.filter(Kt.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src([e+"/app.js",...t],{allowEmpty:!0,cwd:Lt}).pipe(Tt.if("dev"===qt,Tt.watch([e+"/app.js",`${e}/app.${It.css}`],{cwd:Lt},(function(e){Dt("处理"+e.relative+"......")})))).pipe(s).pipe(Tt.replace(/^/,(function(e){return"require('./uni-bootstrap.js');\n"}),{skipBinary:!1})).pipe(s.restore).pipe(a).pipe(Tt.replace(/^/,(function(e){return c.readFileSync(`${Wt}/app.${It.css}`,"utf8")+"\n"}),{skipBinary:!1})).pipe(Tt.rename((function(e){e.extname="."+It.css}))).pipe(a.restore).pipe(i).pipe(Tt.replace(/[\s\S]*/,Ht(r.resolve(Lt,Bt+(Ft.plugin?"/miniprogram":""))),{skipBinary:!1})).pipe(i.restore).pipe(n.dest(Bt+(Ft.plugin?"/miniprogram":""),{cwd:Lt}))}));const Yt=i(),{cwd:zt,target:Vt,env:Zt,projectToSubPackageConfig:Gt,base:Qt,wxResourcePath:Xt,currentNamespace:en,mpTypeNamespace:tn,pluginProcessFileTypes:nn}=A,{writeLastLine:rn}=M,{runPlugins:an}=ye;n.task("watch:mainWeixinMpPackPath",(function(){const e=Gt[en.mainMpPath],a=e+"/"+Gt.subPackagePath,s=Vt+"/"+Gt.subPackagePath,i=[],p=[],o=new Set,l=new Set;Object.keys(tn).forEach(e=>{i.push(`${a}/**/*.${tn[e].css}`),p.push(`${a}/**/*.${tn[e].html}`),o.add("."+tn[e].css),l.add("."+tn[e].html)});const u=Yt.filter([...p],{restore:!0}),g=Yt.filter([...i],{restore:!0}),f=(Yt.filter([a+"/**/*.js"],{restore:!0}),Yt.filter(nn.map(e=>`${a}/**/*.${e}`),{restore:!0}));return n.src([a,a+"/**/*","!"+a+"/pack.config.js"],{allowEmpty:!0,cwd:zt}).pipe(Yt.if("dev"===Zt,Yt.watch([a,a+"/**/*","!/"+a+"/pack.config.js"],{cwd:zt},(function(e){rn("处理"+e.relative+"......")})))).pipe(Yt.filter((function(n){if(n.relative!==en.projectConfig&&!function(e){const t=Gt[en.mainMpPath]+"/"+Gt.subPackagePath;return c.existsSync(e.path.replace(r.resolve(zt,t),r.resolve(zt,Qt)))?["ext.json",en.projectConfig].indexOf(e.relative)>-1&&Gt.mergePack&&""===Gt.subPackagePath:!c.existsSync(e.path.replace(r.resolve(zt,t),r.resolve(zt,Xt)))}(n))return!1;if("unlink"===n.event){try{let a=n.path;const s=RegExp(n.extname+"$","i");o.has(n.extname)&&(a=a.replace(s,"."+en.css)),l.has(n.extname)&&(a=a.replace(s,"."+en.html)),t.sync([a.replace(r.resolve(zt,e),r.resolve(zt,Vt))],{force:!0})}catch(e){}return!1}return!0}))).pipe(u).pipe(Yt.rename((function(e){e.extname="."+en.html}))).pipe(u.restore).pipe(g).pipe(Yt.rename((function(e){e.extname="."+en.css}))).pipe(g.restore).pipe(f).pipe(Yt.replace(/[\s\S]*/,an(r.resolve(zt,s)),{skipBinary:!1})).pipe(f.restore).pipe(n.dest(s,{cwd:zt}))}));const sn=i(),{cwd:pn,target:on,env:cn,projectToSubPackageConfig:ln,subModePath:un,targetPath:gn,program:fn,packIsSubpackage:hn,currentNamespace:mn,mpTypeNamespace:dn,pluginProcessFileTypes:Pn}=A,{writeLastLine:bn}=M,{runPlugins:vn}=ye;n.task("watch:mainWeixinMp",(function(){const e=ln[mn.mainMpPath],a=e+"/"+ln.subPackagePath,s=[],i=[],p=new Set,o=new Set;Object.keys(dn).forEach(t=>{s.push(`${e}/**/*.${dn[t].css}`),i.push(`${e}/**/*.${dn[t].html}`),p.add("."+dn[t].css),o.add("."+dn[t].html)});const c=sn.filter([e+"/app.js"],{restore:!0}),l=(sn.filter([e+"/**/*.js"],{restore:!0}),sn.filter([...i],{restore:!0})),u=sn.filter([...s],{restore:!0}),g=sn.filter(Pn.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src([e+"/**/*","!"+e+"/app.json","!"+e+"/**/*.json___jb_tmp___","!"+e+`/**/*.${mn.html}___jb_tmp___`,"!"+e+`/**/*.${mn.css}___jb_tmp___`,"!"+e+"/**/*.js___jb_tmp___","!"+a+"/**/*"],{base:r.resolve(pn,e),allowEmpty:!0,cwd:pn}).pipe(sn.if("dev"===cn,sn.watch([e+"/**/*","!/"+e+"/app.json","!/"+a+"/**/*"],{cwd:pn},(function(e){e.relative.match(/.json/),bn("处理"+e.relative+"......")})))).pipe(sn.filter((function(n){if("unlink"===n.event){try{let a=n.path;const s=RegExp(n.extname+"$","i");p.has(n.extname)&&(a=a.replace(s,"."+mn.css)),o.has(n.extname)&&(a=a.replace(s,"."+mn.html)),t.sync([a.replace(r.resolve(pn,e),r.resolve(pn,on))],{force:!0})}catch(e){}return!1}return!0}))).pipe(c).pipe(sn.replace(/[\s\S]*/,(function(e){if(hn.mode||fn.plugin)return e;let t=`./${ln.subPackagePath}/`,n="app.js";return un===gn&&(n="uni-bootstrap.js"),e.match(RegExp(`require\\('${t.replace(/\./g,"\\.")}app.js'\\)`))?e:`require('${t}${n}');\n${e}`}),{skipBinary:!1})).pipe(c.restore).pipe(l).pipe(sn.rename((function(e){e.extname="."+mn.html}))).pipe(l.restore).pipe(u).pipe(sn.rename((function(e){e.extname="."+mn.css}))).pipe(u.restore).pipe(g).pipe(sn.replace(/[\s\S]*/,vn(r.resolve(pn,on+(fn.plugin?"/miniprogram":""))),{skipBinary:!1})).pipe(g.restore).pipe(n.dest(on+(fn.plugin?"/miniprogram":""),{cwd:pn}))}));var yn={fakeUniBootstrap:function(e,t,n,r){globalObject.__uniapp2wxpack||(globalObject.__uniapp2wxpack={platform:r}),globalObject.onAppHide&&globalObject.onAppShow||(n="none",console.warn("uniapp2wxpack warn: ide不支持appMode设为relegation和top，所以转为none")),"relegation"!==n||globalObject.onAppRoute||(n="top",console.warn("uniapp2wxpack warn: ide不支持appMode设为relegation，但是支持top，所以转为top"));var a=globalObject.__uniapp2wxpack[t.replace("/","")]={__packInit:{}};if(e)for(var s in e)"function"!=typeof e[s]?a.__packInit[s]=e[s]:function(t){a.__packInit[t]=function(){return e[t].apply(e,arguments)}}(s);else e={};if("none"!==n){var i=Page,p=Component,o="",c=1,l=1;"function"==typeof e.onError&&globalObject.onError&&globalObject.onError((function(){return e.onError.apply(e,arguments)})),"function"==typeof e.onPageNotFound&&globalObject.onPageNotFound&&globalObject.onPageNotFound((function(){return e.onPageNotFound.apply(e,arguments)})),"function"==typeof e.onUnhandledRejection&&globalObject.onUnhandledRejection&&globalObject.onUnhandledRejection((function(){return e.onUnhandledRejection.apply(e,arguments)})),globalObject.onAppRoute&&globalObject.onAppRoute((function(r){"top"!==n&&0!==("/"+r.path).indexOf(t+"/")&&(c=1,e.onHide.call(e,globalObject.getLaunchOptionsSync())),o=r.path})),globalObject.onAppHide((function(r){if("top"===n)return globalObject.getLaunchOptionsSync?e.onHide.call(e,globalObject.getLaunchOptionsSync()):e.onHide.call(e,r);var a=getCurrentPages();return 0===("/"+(null==a[a.length-1].route?a[a.length-1].__route__:a[a.length-1].route)).indexOf(t+"/")?(c=1,o="",e.onHide.call(e,globalObject.getLaunchOptionsSync())):void 0})),globalObject.onAppShow((function(t){if(l&&(getApp()&&(getApp().globalData||(getApp().globalData={}),Object.assign(getApp().globalData,e.globalData||{})),l=0),"top"===n&&"function"==typeof e.onShow)return globalObject.getLaunchOptionsSync?e.onShow.call(e,globalObject.getLaunchOptionsSync()):e.onShow.call(e,t)})),"top"===n&&l&&"function"==typeof e.onLaunch&&globalObject.getLaunchOptionsSync&&e.onLaunch.call(e,globalObject.getLaunchOptionsSync()),Page=function(e){return u(e),i.call(this,e)},Component=function(e){return u(e.methods||{}),p.call(this,e)}}function u(r){if("top"!==n){var a=r.onShow;"function"!=typeof e.onShow&&"function"!=typeof e.onLaunch||(r.onShow=function(){var n=getCurrentPages(),r=null==n[n.length-1].route?n[n.length-1].__route__:n[n.length-1].route;if(o&&0===("/"+o).indexOf(t+"/")||0!==("/"+r).indexOf(t+"/")||(c&&(c=0,e.onLaunch.call(e,globalObject.getLaunchOptionsSync())),e.onShow.call(e,globalObject.getLaunchOptionsSync())),"function"==typeof a)return a.apply(this,arguments)})}}},fakeUniBootstrapName:"fakeUniBootstrap"};const{basePath:wn,targetPath:jn,subModePath:kn,currentNamespace:xn}=A;var $n=function(e){const t=r.resolve(jn,"app.js"),n=r.resolve(jn,"app."+xn.css),a=e.path.replace(wn,kn);return t===a||n===a};const Sn=i(),{regExpWxResources:On,regExpUniRequire:_n}=A,{getLevelPath:En,getLevel:Cn}=M;var An={uniRequireWxResource:function(){return Sn.replace(/[\s\S]*/,(function(e,t){const n=["var __uniPackNativeRequireInject={};\n"],r=Cn(this.file.relative);return e=e.replace(_n,(e,t)=>{console.log(`\n编译${e}--\x3erequire(${t.replace(On,En(r))})`);const a=t.replace(On,En(r)),s=`__uniPackNativeRequireInject[${a}] = require(${a});\n`;return 0>n.indexOf(s)&&n.push(s),`__uniPackNativeRequireInject[${a}]`}),n[1]?`${n.join("")} ${e}`:e}),{skipBinary:!1})}};const{currentNamespace:Nn,regExpWxResources:Rn,wxResourceAlias:Mn}=A,{getLevelPath:Tn,getLevel:Ln}=M;var Bn=function(e,t){const n=Ln(t);return"@import "+`"${Mn}/common/main.${Nn.css}";`.replace(Rn,Tn(n))+("\n"+e)};const qn=i(),{fakeUniBootstrapName:Jn,fakeUniBootstrap:Fn}=yn,{cwd:Wn,env:In,program:Un,basePath:Kn,targetPath:Dn,subModePath:Hn,base:Yn,regExpUniRequire:zn,regExpWxResources:Vn,regExpUniImportWxss:Zn,currentNamespace:Gn,mpTypeNamespace:Qn,pluginProcessFileTypes:Xn,sourceCodePath:er,projectToSubPackageConfig:tr}=A,nr=process.env.PACK_TYPE,{writeLastLine:rr,getLevel:ar,getLevelPath:sr,deepFind:ir}=M,{uniRequireWxResource:pr}=An,{runPlugins:or}=ye,cr=Object.keys(Qn).map(e=>Qn[e].css),lr=new Set(cr);n.task("subMode:createUniSubPackage",(function(){c.mkdirsSync(Kn);const e=qn.filter(Yn+"/**/*.js",{restore:!0}),a=qn.filter([Yn+"/common/vendor.js"],{restore:!0}),s=qn.filter([Yn+"/common/main.js"],{restore:!0}),i=qn.filter(Xn.map(e=>`${Yn}/**/*.${e}`),{restore:!0}),p=qn.filter([Yn+"/**/*.js","!"+Yn+"/app.js","!"+Yn+"/uni-bootstrap.js","!"+Yn+"/common/vendor.js","!"+Yn+"/common/main.js","!"+Yn+"/common/runtime.js"],{restore:!0}),o=qn.filter([`${Yn}/**/*.${Gn.css}`,`!${Yn}/app.${Gn.css}`,`!${Yn}/common/main.${Gn.css}`],{restore:!0}),l=qn.filter([`${Yn}/**/*.${Gn.css}`,`!${Yn}/app.${Gn.css}`],{restore:!0}),u=qn.filter([Yn+"/**/*.json"],{restore:!0}),g=qn.filter([`${Yn}/**/*.${Gn.html}`],{restore:!0});return n.src([Yn+"/**","!"+Yn+"/app.json",Yn+"/app.js",`${Yn}/app.${Gn.css}`],{allowEmpty:!0,cwd:Wn}).pipe(qn.if("dev"===In,qn.watch([Yn+"/**/*","!/"+Yn+"/app.json"],{cwd:Wn},(function(e){rr("处理"+e.relative+"......")})))).pipe(qn.filter((function(e){if(function(e){if(0>["ext.json",Gn.projectConfig].indexOf(e.relative))return!1;if(tr.mergePack&&""===tr.subPackagePath){if(c.existsSync(r.resolve(Wn,tr[Gn.mainMpPath],e.relative)))return!0}return!1}(e))return!1;if("unlink"===e.event){try{let n=e.path;const a=RegExp(e.extname+"$","i");lr.has(e.extname.substr(1))&&(n=n.replace(a,"."+Gn.css)),t.sync([n.replace(Kn,r.resolve(Wn,Hn))],{force:!0})}catch(e){}return!1}return!$n(e)||".js"===e.extname&&(e.basename="uni-bootstrap.js",!0)}))).pipe(g).pipe(qn.replace(/[\s\S]*/,(function(e){const t=this.file.path.replace(RegExp(Gn.html+"$","i"),Gn.css),n=this.file.relative.replace(RegExp(Gn.html+"$","i"),Gn.css);c.existsSync(t)||c.outputFileSync(r.resolve(Wn,Hn,n),Bn("",n));const a=new I(e);let s=0;return ir(a.topNode,e=>{if(1===e.type&&"wxs"===e.tag&&1===e.children.length&&3===e.children[0].type){e.children[0].text.replace(zn,(t,n,r,a)=>{const i=ar(this.file.relative),p=n.replace(Vn,sr(i)).replace(/['"]/g,"");e.attrsMap.src=p,e.children=[],s=1,console.log(`\n编译${t}--\x3erequire(${p})`)})}}),s?a.render():e}),{skipBinary:!1})).pipe(g.restore).pipe(a).pipe(qn.replace(/^/,(function(e){return Un.plugin?`var App=function(packInit){};${Gn.globalObject}.canIUse=function(){return false};`:`var __packConfig=require('../pack.config.js');var App=function(packInit){var ${Jn}=${(""+Fn).replace(/globalObject/g,Gn.globalObject)};${Jn}(packInit,__packConfig.packPath,__packConfig.appMode,'${nr}');};`}),{skipBinary:!1})).pipe(a.restore).pipe(e).pipe(f()).pipe(pr()).pipe(e.restore).pipe(s).pipe(qn.replace(/^/,(function(e){return"var __uniPluginExports={};\n"}),{skipBinary:!1})).pipe(qn.replace(/$/,(function(e){return"\nmodule.exports=__uniPluginExports;"}),{skipBinary:!1})).pipe(s.restore).pipe(p).pipe(qn.replace(/^/,(function(e){if(c.existsSync(r.resolve(Wn,er,this.file.relative)))return e;let t=sr(ar(this.file.relative)),n="app.js";return Hn===Dn&&(n="uni-bootstrap.js"),`require('${t}${n}');\n`}),{skipBinary:!1})).pipe(p.restore).pipe(u).pipe(qn.replace(/[\s\S]*/,(function(e){if(!c.existsSync(r.resolve(Wn,er,this.file.relative.replace(/json$/,"vue")))&&!c.existsSync(r.resolve(Wn,er,this.file.relative.replace(/json$/,"nvue"))))return e;let t=JSON.parse(""+this.file.contents);for(let e in t.usingComponents)0===t.usingComponents[e].indexOf("/")&&(t.usingComponents[e]=sr(ar(this.file.relative))+t.usingComponents[e].replace(/^\//,""));return JSON.stringify(t)}),{skipBinary:!1})).pipe(u.restore).pipe(l).pipe(qn.stripCssComments()).pipe(qn.replace(Zn,(function(e,t,n){let r="",a=ar(this.file.relative);return(n+=";").replace(/\s*import\s*:\s*(('[^\s';]*')|("[^\s";]*"))/g,(function(e,t){const n=RegExp(`(${cr.join("|")})(['"])$`);t=t.replace(n,Gn.css+"$2"),r+=`@import ${t.replace(Vn,sr(a))};\n`})),t+r}),{skipBinary:!1})).pipe(l.restore).pipe(o).pipe(qn.stripCssComments()).pipe(qn.replace(/^[\s\S]*$/,(function(e){return Hn===Dn?e:Bn(e,this.file.relative)}),{skipBinary:!1})).pipe(o.restore).pipe(i).pipe(qn.replace(/[\s\S]*/,or(Hn),{skipBinary:!1})).pipe(i.restore).pipe(n.dest(Hn,{cwd:Wn}))}));const ur=i(),{cwd:gr,env:fr,targetPath:hr,subModePath:mr,regExpWxResources:dr,regExpUniImportWxss:Pr,wxResourcePath:br,currentNamespace:vr,mpTypeNamespace:yr,pluginProcessFileTypes:wr}=A,{writeLastLine:jr,getLevel:kr,getLevelPath:xr}=M,{uniRequireWxResource:$r}=An,{runPlugins:Sr}=ye,Or=[],_r=[],Er=[],Cr=new Set,Ar=new Set;Object.keys(yr).forEach(e=>{Or.push(yr[e].css),_r.push(`${br}/**/*.${yr[e].css}`),Er.push(`${br}/**/*.${yr[e].html}`),Cr.add("."+yr[e].css),Ar.add("."+yr[e].html)}),n.task("subMode:copyWxResource",(function(){const e=ur.filter([br+"/**/*.js"],{restore:!0}),a=ur.filter([..._r],{restore:!0}),s=ur.filter([...Er],{restore:!0}),i=ur.filter(wr.map(e=>`${br}/**/*${e}`),{restore:!0});return n.src([br+"/**",br],{allowEmpty:!0,cwd:gr}).pipe(ur.if("dev"===fr,ur.watch([br+"/**",br,`!/${br}/**/*.*___jb_tmp___`],{cwd:gr},(function(e){jr("处理"+e.relative+"......")})))).pipe(e).pipe(ur.replace(/^/,(function(e){let t=xr(kr(this.file.relative)),n="app.js";return mr===hr&&(n="uni-bootstrap.js"),`require('${t}${n}');\n`}),{skipBinary:!1})).pipe(f()).pipe($r()).pipe(e.restore).pipe(a).pipe(ur.stripCssComments()).pipe(ur.replace(Pr,(function(e,t,n){let r="";kr(this.file.relative);return t+r}),{skipBinary:!1})).pipe(ur.replace(/^[\s\S]*$/,(function(e){return mr===hr?e:Bn(e,this.file.relative)}),{skipBinary:!1})).pipe(ur.rename((function(e){e.extname="."+vr.css}))).pipe(a.restore).pipe(s).pipe(ur.rename((function(e){e.extname="."+vr.html}))).pipe(s.restore).pipe(ur.filter((function(e){if("unlink"===e.event){try{let n=e.path;const a=RegExp(e.extname+"$","i");Cr.has(e.extname)&&(n=n.replace(a,"."+vr.css)),Ar.has(e.extname)&&(n=n.replace(a,"."+vr.html)),t.sync([n.replace(r.resolve(gr,br),r.resolve(gr,mr))],{force:!0})}catch(e){}return!1}return!0}))).pipe(i).pipe(ur.replace(/[\s\S]*/,Sr(mr),{skipBinary:!1})).pipe(i.restore).pipe(n.dest(mr,{cwd:gr}))}));const Nr=i(),{cwd:Rr,target:Mr,env:Tr,projectToSubPackageConfig:Lr,currentNamespace:Br,mpTypeNamespace:qr,pluginProcessFileTypes:Jr}=A,{writeLastLine:Fr}=M,{runPlugins:Wr}=ye;n.task("watch:native",(function(){const e=Lr[Br.mainMpPath],a=[],s=[],i=new Set,p=new Set;Object.keys(qr).forEach(t=>{a.push(`${e}/**/*.${qr[t].css}`),s.push(`${e}/**/*.${qr[t].html}`),i.add("."+qr[t].css),p.add("."+qr[t].html)});Nr.filter([e+"/**/*.js"],{restore:!0});const o=Nr.filter([...s],{restore:!0}),c=Nr.filter([...a],{restore:!0}),l=Nr.filter(Jr.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src([e+"/**/*","!"+e+"/app.json"],{base:r.resolve(Rr,e),allowEmpty:!0,cwd:Rr}).pipe(Nr.if("dev"===Tr,Nr.watch([e+"/**/*","!/"+e+"/app.json"],{cwd:Rr},(function(e){Fr("处理"+e.relative+"......")})))).pipe(Nr.filter((function(n){if("unlink"===n.event){try{let a=n.path;const s=RegExp(n.extname+"$","i");i.has(n.extname)&&(a=a.replace(s,"."+Br.css)),p.has(n.extname)&&(a=a.replace(s,"."+Br.html)),t.sync([a.replace(r.resolve(Rr,e),r.resolve(Rr,Mr))],{force:!0})}catch(e){console.log(e)}return!1}return!0}))).pipe(o).pipe(Nr.rename((function(e){e.extname="."+Br.html}))).pipe(o.restore).pipe(c).pipe(Nr.rename((function(e){e.extname="."+Br.css}))).pipe(c.restore).pipe(l).pipe(Nr.replace(/[\s\S]*/,Wr(r.resolve(Rr,Mr)),{skipBinary:!1})).pipe(l.restore).pipe(n.dest(Mr,{cwd:Rr}))}));const{cwd:Ir,env:Ur,targetPath:Kr,subModePath:Dr,projectToSubPackageConfig:Hr,program:Yr,currentNamespace:zr}=A,{tryAgain:Vr}=M;async function Zr(e){let t=r.resolve(Ir,Hr[zr.mainMpPath],"app.js");await c.exists(t)||await c.outputFile(t,"App({});"),e()}n.task("mpWxSubMode",n.series((function(e){console.log("小程序解耦构建开启，此过程如果出现权限问题，请使用管理员权限运行"),e()}),"clean:previewDist",(async function e(t){if(Yr.plugin||Yr.native)t();else{try{let e={packPath:(Hr.subPackagePath?"/":"")+Hr.subPackagePath,appMode:Hr.appMode};await c.outputFile(Dr+"/pack.config.js","module.exports="+JSON.stringify(e,null,4))}catch(n){return void await Vr(async()=>{await e(t)})}t()}}),function(){let e=[Zr,"subMode:createUniSubPackage","subMode:copyWxResource",...Yr.plugin?["watch:pluginJson"]:["watch:baseAppJson","watch:pagesJson",...Hr.mergePack?["watch:mainWeixinMpPackPath"]:[],...Dr===Kr?["watch:topMode-mainAppJsAndAppWxss"]:[]],"watch:mainAppJson","watch:mainWeixinMp","watch:projectConfigJson"];return Yr.native&&(e=[Zr,"watch:mainAppJson","watch:native"]),"build"===Ur?n.series.apply(this,e):n.parallel.apply(this,e)}(),(function(e){e(),"build"===Ur&&process.exit()})));const{cwd:Gr,basePath:Qr,base:Xr,program:ea}=A;n.task("startToPackServe",n.series((async function(e){ea.native||await c.exists(Qr)||await c.mkdirs(Qr),e()}),"clean:base",(function(e){ea.native?e():n.watch(Xr+"/app.json",{events:["all"],cwd:Gr},(function(){e()}))}),"mpWxSubMode")),process.on("unhandledRejection",()=>{});
