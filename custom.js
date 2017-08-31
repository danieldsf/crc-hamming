const app = angular.module("app", []);
const regex_binnary = /^[01]*$/;

$(document).ready(function(){
    $("#aCRC").click(function(e){
      $("#crc").show();
      $("#ham").hide();
    });

    $("#aHam").click(function(e){
      $("#ham").show();
      $("#crc").hide();
    });

    $("#crc").toggle();
    $("#ham").toggle();
});

app.controller('crcController', ['$scope', function ($scope) {
    $scope.regex = /^[01]*$/;
    $scope.generator = "101101";
    $scope.sentNumber = "";
    $scope.code = "111100101";
    $scope.valid = "";
    $scope.sentList = [];
    $scope.sentRange = [];
    $scope.pressed = false;

    $scope.createCRC = function(){
      var currentNumber = $scope.crc.code.$viewValue.toString();
      var dividedNumber = currentNumber;
      for (var i = 1; i < $scope.generator.length; i++) {
          dividedNumber += "0";
      }
      var resto = loopXOR(dividedNumber, $scope.generator);
      var sentNumber = dividedNumber.slice(0, dividedNumber.toString().length - resto.toString().length) + resto;

      console.log(sentNumber);

      sentNumber = sentNumber.toString();
      //console.log(sentNumber);
      $scope.pressed = true;
      $scope.sentNumber = sentNumber;
      $scope.code_checked = sentNumber;

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
      var currentNumber = $scope.crc.code_checked.$viewValue.toString();
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
    $scope.code_checked = ""
    $scope.pressed = false;
    $scope.parityLabel = "Par";
    $scope.position = false;
    $scope.valid = false;
    $scope.notice = false;

    $scope.updateParity = function(){
      var parity = $scope.ham.parity.$viewValue;
      $scope.parity = parity;
      if(parity == 'p'){
        $scope.parityLabel = "PAR";
      }else if(parity == 'i'){
        $scope.parityLabel = "IMPAR";
      }
    }

    $scope.checkCRC = function(){
        var toCheck = $scope.ham.code_error.$viewValue;

        $scope.sentNumber = toCheck;

        var verificators = checkVerifiers(toCheck);
        var cont = 0;
        var indexes = [];
        var soma = 0;
        console.log(verificators);

        var masterVer = [];
        for (var i = 0; i < verificators.length; i++) {
          masterVer.push(verificators[i][0]);
        }

        $scope.finalVerificators = verificators;
        $scope.verificators = masterVer;

        for (var i = 0; i < verificators.length; i++) {
          var master = verificators[i][0];
          var temp = "0";

          for (var j = 1; j < verificators[i].length; j++) {
              temp = divideXOR(temp, toCheck[verificators[i][j]-1]);
          }
          //
          var value = checkParityBit(divideXOR(temp, "0"), $scope.parity);

          console.log("MASTER = " + toCheck[master-1]);
          console.log("PARITY = " + value);
          console.log("TEMP = "   + temp);

          if(divideXOR(toCheck[master - 1], value) == "1"){
              soma = soma + master;
              indexes.push(master)
          }
          //
          if(soma == 0){
            $scope.valid = "VALIDO";
            $scope.notice = false;
          }else {
            $scope.valid = "INVALIDO"
            $scope.notice = "INDICE INVERTIDO: " + soma + " / ERROS EM: " + indexes;
          }
        }
        //
        console.log("INDICE DE ERRO: " + indexes);
        console.log("QUANTIDADE DE ERROS: " + cont);
        //
    }

    $scope.createHamming = function(){
      $scope.notice = false;
      $scope.valid = false;
      $scope.pressed = true;
      var currentNumber = $scope.ham.code.$viewValue;
      var nextNumber = generateBaseSequence(currentNumber);
      var verificators = nextNumber.verificators;
      nextNumber = nextNumber.lista;
      var parity = $scope.ham.parity.$viewValue;

      var finalVerificators = getFinalNumber(nextNumber, verificators, parity).lista;
      //var parityBit = checkParityBit(nextNumber, parity);
      var finalNumber = nextNumber.toString();
      $scope.finalVerificators = finalVerificators;
      $scope.verificators = verificators;
      //Paridade
      $scope.sentNumber = getFinalNumber(nextNumber, verificators, parity).number;
      $scope.code_error = $scope.code_checked = $scope.sentNumber;
    }

    function checkVerifiers(code){
        var index = 1;
        var verificatorValues = [];

        for (var i = index; i-1 < code.length; i *=2 ) {
            verificatorValues.push(i);
        }

        var total_verificators = [];
        for (var i = 0; i < verificatorValues.length; i++) {
          var qtdOne = 0;
          var k = cont = 0;
          var lista_per_verificator = [];
          var temp = code[verificatorValues[i]-1].toString();
          for (k; k + verificatorValues[i] <= code.length;) {
              temp = divideXOR(temp, code[k + verificatorValues[i] - 1]);
              lista_per_verificator.push(k + verificatorValues[i]);
              if(cont == verificatorValues[i] - 1){
                k += verificatorValues[i] + 1;
                cont = 0;
              }else{
                cont++;
                k++;
              }
          }

          total_verificators.push(lista_per_verificator);
        }
        return total_verificators;
    }

    function appendParity(valor, verificators, parity){
      	var cont = 0;
      	for (var i = 0; i < verificators.length; i++) {
      		if(valor[verificators[i]-1] == "1"){
      			if(parity == "p"){
      				valor = setCharAt(valor, verificators[i]-1, "0");
      			}
      		}else if(valor[verificators[i]-1] == "0"){
      			if(parity == "i"){
      				valor = setCharAt(valor, verificators[i]-1, "1");
      			}
      		}
      	}
      	return valor;
    }

    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    function checkParityBit(bit, parity){
      if(bit == "0" && parity == "p" || bit == "1" && parity == "i"){
        return "0";
      }else{
        return "1";
      }
    }

    function getFinalNumber(nextNumber, verificators, parity){
      var finalNumber = nextNumber;
      var total_verificators = [];
      for (var i = 0; i < verificators.length; i++) {
        var qtdOne = 0;
        var k = cont = 0;
        var lista_per_verificator = [];
        var temp = finalNumber[verificators[i]-1].toString(); // == "1" ? "0" : finalNumber[verificators[i]-1].toString();
        for (k; k + verificators[i] <= nextNumber.length;) {
            temp = divideXOR(temp, finalNumber[k + verificators[i] - 1]);
            lista_per_verificator.push(k + verificators[i]);
            if(cont == verificators[i] - 1){
              k += verificators[i] + 1;
              cont = 0;
            }else{
              cont++;
              k++;
            }
        }
        var value = checkParityBit(temp, parity);
        finalNumber = setCharAt(finalNumber.toString(), verificators[i]-1, value.toString());
        total_verificators.push(lista_per_verificator);
      }
      return {"lista": total_verificators, "number": finalNumber};
    }

    function generateBaseSequence(x){
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
