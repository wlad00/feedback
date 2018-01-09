(function () {
    'use strict';
    angular.module('panelsApp')
        .service('helperService', function () {
            var diklaID,
                currentCompany;

            function setDiklaID(data) {
                if (data) {
                    diklaID = +data;
                }
            }

            function getDiklaID() {
                return diklaID;
            }

            function setCurrentCompany(data) {
                currentCompany = data ? +data : '';
            }

            function getCurrentCompany() {
                return currentCompany;
            }

            return {
                setDiklaID: setDiklaID,
                getDiklaID: getDiklaID,
                setCurrentCompany: setCurrentCompany,
                getCurrentCompany: getCurrentCompany
            }

        });

}());