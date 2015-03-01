function comp (id){
    var general   = componentInfo.tblComponents[id];
	
	this.compID   = id;
    this.name     = general.componentName;
    this.img      = general.imageFile;
    this.prc      = general.price;
    this.budget   = general.budgetClass;
	this.type	  = general.type;

    return this;
}

function comp_cpu (id){
    var temp = comp(id);
    $.extend(this, temp);

    var specific  = componentInfo.tblCPU[id];

    this.arch     = specific.architecture;
    this.sock     = specific.socket;
    this.cores    = specific.cores;
    this.base     = specific.baseFreq;
    this.watt     = specific.wattage;
    this.cach     = specific.cache;
}
