/**
 * px2dt-localdata-access
 */
module.exports = new (function(){
	var fs = require('fs');
	var path = require('path');
	var mkdirp = require('mkdirp');

	function px2dtLocalDataAccess(pathDataDir, options){
		var _this = this;
		this.pathDataDir = pathDataDir;
		this.options = options;
		this.db = {};
		this.db = this.loadSync();
	}

	/**
	 * データディレクトリの初期化
	 */
	px2dtLocalDataAccess.prototype.initDataDir = function(cb){
		cb = cb || function(){};

		mkdirp(this.pathDataDir, function (err) {
			if (err){ console.error(err); }
			else{ cb(true); }
		});

		return this;
	}

	/**
	 * データを読み込む(同期)
	 */
	px2dtLocalDataAccess.prototype.loadSync = function(){
		var db = {};
		if( fs.existsSync(this.pathDataDir+'/db.json') ){
			db = require( this.pathDataDir+'/db.json' );
		}
		return db;
	}

	/**
	 * データを読み込む
	 */
	px2dtLocalDataAccess.prototype.load = function(cb){
		cb = cb || function(){};

		var db = {};
		if( fs.existsSync(this.pathDataDir+'/db.json') ){
			db = require( this.pathDataDir+'/db.json' );
		}
		cb(db);
		return this;
	}

	/**
	 * データを保存する
	 */
	px2dtLocalDataAccess.prototype.save = function(cb){
		cb = cb || function(){};
		fs.writeFile(this.pathDataDir+'/db.json', JSON.stringify(this.db,null,1), function(err){
			var result = true;
			if(err){result = false;}
			cb(result);
		});
		return this;
	}

	/**
	 * プロジェクト情報を追加する
	 */
	px2dtLocalDataAccess.prototype.addProject = function(pjInfo, cb){
		cb = cb || function(){};
		this.db = this.db || {};
		this.db.projects = this.db.projects || [];

		if(typeof(pjInfo) !== typeof({})){ cb(false);return this; }
		if(typeof(pjInfo.name) !== typeof('')){ cb(false);return this; }
		if(typeof(pjInfo.path) !== typeof('')){ cb(false);return this; }
		if(typeof(pjInfo.entry_script) !== typeof('')){ cb(false);return this; }

		this.db.projects.push(pjInfo);

		this.db.projects.sort(function(a,b){
			var aStr = a.name.toLowerCase();
			var bStr = b.name.toLowerCase();
			if(aStr > bStr)  return 1;
			if(aStr < bStr)  return -1;
			return 0;
		});

		cb(true);
		return this;
	}

	/**
	 * プロジェクト情報の一覧を取得する
	 */
	px2dtLocalDataAccess.prototype.getProjectAll = function(cb){
		cb = cb || function(){};
		cb(this.db.projects);
		return this;
	}

	/**
	 * プロジェクト情報を取得する
	 */
	px2dtLocalDataAccess.prototype.getProject = function(pjCd, cb){
		cb = cb || function(){};
		cb(this.db.projects[pjCd]);
		return this;
	}

	/**
	 * プロジェクト情報を削除する
	 */
	px2dtLocalDataAccess.prototype.removeProject = function(pjCd, cb){
		cb = cb || function(){};
		if(typeof(pjCd) != typeof(0)){
			cb(false);
			return this;
		}

		var beforeLen = this.db.projects.length;
		this.db.projects.splice( pjCd, 1 );
		var afterLen = this.db.projects.length;

		cb( beforeLen === (afterLen+1) );
		return this;
	}

	/**
	 * Px2DTLDAオブジェクトを作成する
	 */
	this.create = function(pathDataDir, options){
		var px2dtLDA = new px2dtLocalDataAccess(pathDataDir, options);
		return px2dtLDA;
	}

})();