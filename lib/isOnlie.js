/**
 * Created by lcr on 17-6-28.
 */
module.exports=(time,freq)=>{
	let now = new Date;
	if(now-time<=freq*60000) return true;
	else return false;
};