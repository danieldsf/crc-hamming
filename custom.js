const app = angular.module("app", []);
const regex_binnary = /^[01]*$/;
//
app.controller('crcController', ['$scope', function ($scope) {
    $scope.regex = /^[01]*$/;
    $scope.generator = "101101";
    $scope.sentNumber = "";
    $scope.code = "111100101";
    $scope.valid = "";
    $scope.sentList = [];
    $scope.sentRange = [];

    $scope.createCRC = function(){
      var currentNumber = $scope.crc.code.$viewValue.toString();
      var dividedNumber = currentNumber;
      for (var i = 1; i < $scope.generator.length; i++) {
          dividedNumber += "0";
      }
      var resto = loopXOR(dividedNumber, $scope.generator);
      var sentNumber = parseInt(dividedNumber) + parseInt(resto);
      sentNumber = sentNumber.toString();
      //console.log(sentNumber);
      $scope.sentNumber = sentNumber;
      $scope.sentList =  getListByNumber(sentNumber);
      $scope.sentRange = getListByRange(sentNumber);
    }

    function getListByNumber(number){
      var output = [], sNumber = number.toString();
      for (var i = 0, len = sNumber.length; i < len; i += 1) {
        output.push(sNumber.charAt(i));
      }
      console.log(output);
      return output;  
    }

    function getListByRange(lista){
      var container = [];
      for (var i = 0; i < lista.length; i++) {
        container.push(i+1);
      }
      return container;
    }

    function loopXOR(dividend, divisor){
        var a = parseInt(dividend);
        var b = parseInt(divisor);

        var temp = a;
        while(temp.toString().length >= b.toString().length){
            var next = "";
            for(var i = 0; i < b.toString().length; i++){
              next += divideXOR(temp.toString()[i], b.toString()[i]);
            }
            next += temp.toString().slice(b.toString().length, temp.toString().length);
            temp = parseInt(next).toString();
        }
        return temp;
    }

    $scope.checkCRC = function(){
      //generate random generator:
      var currentNumber = $scope.crc.code.$viewValue.toString();
      //var currentNumberSize = currentNumber.length;
      var resto = loopXOR(currentNumber, $scope.generator);
      if(parseInt(resto) == 0){
        $scope.valid = "Valido";
      }else{
        $scope.valid = "Invalido";
      }
    }
}]);

function divideXOR(a, b){
  return (a == b) ? "0" : "1";
}



app.controller('hammingController', ['$scope', function ($scope) {
    $scope.regex = /^[01]*$/;
    $scope.code = "1111";
    $scope.parity = "p";

    $scope.createHamming = function(){
      var currentNumber = $scope.ham.code.$viewValue;
      var parity = $scope.ham.parity.$viewValue;
      console.log(parity);
      var nextNumber = generateBaseSequence(currentNumber);
      var verificators = nextNumber.verificators;
      nextNumber = nextNumber.lista;
      console.log(nextNumber);
      var finalVerificators = getFinalNumber(nextNumber, verificators, parity);
      console.log(finalVerificators);
      var parityBit = checkParityBit(nextNumber, parity);

      var finalNumber = nextNumber.toString();
      for (var i = 0; i < verificators.length; i++) {
          var temp = parityBit;
          for (var j = 0; j < finalVerificators[i].length; j++) {
              temp = divideXOR(temp, nextNumber[finalVerificators[i][j-1]]);
          }
          //console.log(verificators[i]-1);
          console.log(temp);
          finalNumber = setCharAt(finalNumber,verificators[i],temp);
      }

      $scope.sentNumber = finalNumber;
    }

    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    function checkParityBit(nextNumber, parity){
      var cont = 0;
      for (var i = 0; i < nextNumber.toString().length; i++) {
          if(nextNumber.toString()[i] == "1")
            cont++;
      }

      if(cont % 2 == 0){
        return divideXOR("1", parity == "p" ? "1" : "0");
      }
      return divideXOR("0", parity == "p" ? "1" : "0");
    }

    function getFinalNumber(nextNumber, verificators, parity){
      var finalNumber = nextNumber;
      var total_verificators = [];
      for (var i = 0; i < verificators.length; i++) {
        console.log("FOR: " + verificators[i]);
        var k = cont = 0;
        var lista_per_verificator = [];
        for (k; k + verificators[i] < nextNumber.length;) {
            console.log(k + verificators[i]);
            lista_per_verificator.push(k + verificators[i]);
            if(cont == verificators[i] - 1){
              k += verificators[i] + 1;
              cont = 0;
            }else{
              cont++;
              k++;
            }
        }
        total_verificators.push(lista_per_verificator);
      }

      return total_verificators;
      //return finalNumber;
    }

    function generateBaseSequence(x){ //OK
        //var even = [1,2,4,8,16,32,64,128,256,512,1024,2048];

        var tempNumber = "";
        var lastPerfect = i = 1;
        var cont = x.toString().length;
        var verificators = [];
        while(cont > 0){
          if(i % lastPerfect == 0){
            tempNumber += "0";
            lastPerfect = i;
            verificators.push(i);
          }else{
            var current = x.toString()[x.toString().length - cont];
            tempNumber += current;
            cont -= 1;
          }
          i++;
        }
        return {"lista": tempNumber, "verificators": verificators};
    }
}]);
