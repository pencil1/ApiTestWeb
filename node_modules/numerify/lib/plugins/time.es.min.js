var time={regexp:/:/,format:function(r,t,o){var a=Math.floor(r/60/60),e=Math.floor((r-60*a*60)/60),f=Math.round(r-60*a*60-60*e);return[a,e<10?"0"+e:e,f<10?"0"+f:f].join(":")}};export default time;
