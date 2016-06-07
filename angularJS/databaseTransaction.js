    // saves/get user info to/from websql.
    // if user doesn't exist, insert new data.
    // Use for auto login
    
    //example for auto login to use in main controller
    //Get email and pw from dbTransaction service                
    // var promise = dbTransaction.getUser(); 
    // if(promise){
    //     promise.then(function(){
    //login using loginUser service
    //         loginUser.login(profile.email, profile.password);
    //     }); 
    // }  
    app.service('dbTransaction', function($rootScope, $q){
       var db;
       
       this.getConcepeaDb = function(){
           return window.openDatabase('database', "1.0", "concepea", 100);
       };
       this.errorCb = function(err){
           alertThis("Error occured while executing SQL: "+err.code);
       };
        //store user info into websql    
        this.saveUser = function(email, password){
            var self = this;
            db = self.getConcepeaDb();   
            db.transaction(function(tx){
               tx.executeSql('CREATE TABLE IF NOT EXISTS USER_TABLE (email unique, password)');
               tx.executeSql('INSERT OR REPLACE INTO USER_TABLE (email, password) VALUES ("' + email + '", "'+ password + '")');
               console.log("wrote " + email + " " + password + " " + 'INSERT INTO USER_TABLE(email, password) VALUES ("' + email +'", "' + password + '")');
            });
        };
        //get user info from web sql  
        this.getUser = function(){
            showLoading();
            var self = this;
            db = self.getConcepeaDb();
            var deferred = $q.defer();
            setTimeout(function(){
            db.transaction(function(tx){
                tx.executeSql('CREATE TABLE IF NOT EXISTS USER_TABLE (email unique, password)');
                tx.executeSql('SELECT * FROM USER_TABLE', [], 
                function(tx,result){
                    var len = result.rows.length;
                    if(len > 0){
                        //stores email and password to profile global var
                        profile.email = result.rows.item(len-1).email;
                        profile.password = result.rows.item(len-1).password;
                        $rootScope.$apply(function(){
                            deferred.resolve('worked');
                        });
                    }else{
                        hideLoading();
                        return;
                    }
                },  function(error){
                        deferred.reject('something went wrong!');
                    });
                });
            }, 1000);
            return deferred.promise;
        };

           
    });