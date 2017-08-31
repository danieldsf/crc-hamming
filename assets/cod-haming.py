#!/usr/bin/env python
# -*- coding: utf-8 -*-

listOfPowerOfTwo = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]

''' Casos de teste

    testTransmit1 = "1110010101011"
    testTransmit2 = "111001010101100"
    testVerify1 = "10101101010101011" - Sem erro
    testVerify2 = "10111101010101011" - Com erro na posição 4

'''

def isPowerOfTwo(i):
    #Simples funcao de verificação se o numero é potuncia de dois ou nuo, retorna True ou False
    return (i in listOfPowerOfTwo)

#00000001
# 1 << 2
#00000100

#Funcao que usa left shift para obter valor True ou False da posição bitPosition de qualquer número
def getBitValue(number, bitPosition):
    position = (1 << bitPosition)
    return (number & position) == position;

#Usando getBitValue, vejo ate no maximo de 32 posicoes (o tamanho de um int) quais os bits True de um determinado numero, assim obtendo todos os necessarios para forma-lo com uma soma
def getNumbersWithBinary(number):
    result = []
    for i in range(32):
        bit = getBitValue(number, i)
        if(bit):
            result.append(number & (1 << i))
    return result

def getQuantityToIncrement(string):
    #Funcao para contar a quantidade de potencias de dois na palavra a ser usada para adicionar os slots
    quantity = 0
    for i in range(len(string)):
        if(isPowerOfTwo(i+1)):
            quantity += 1
    return quantity

def getParity(powerOfTwo, binaries, usingEven):

    #Aqui verifico a paridade, pegando o conjunto de soma via subset_sum de cada posição e verificando se a potência de dois dada está na lista retornada
    #Se estiver na lista e se o valor da posicao for 1, o contador é incrementado para verificação de paridade posterior
    #usingEven é um boolean que determina se está usando paridade par ou não, binaries é a palavra e powerOfTwo a potência de dois a verificar a paridade

    count = 0
    usedPositions = []
    for i in range(len(binaries)):
        if(not isPowerOfTwo(i+1)):
            j = i + 1
            result = getNumbersWithBinary(j)
            if(powerOfTwo in result and binaries[i] == "1"):
                usedPositions.append(j)
                print("binaries[i] =", binaries[i], "// j =", j, "// result =",result)
                count += 1

    parity = 0

    if(usingEven):
        parity = 0 if (count % 2 == 0) else 1
    else:
        parity = 1 if (count % 2 == 0) else 0

    print("A paridade do bit", powerOfTwo, "é", parity, "// contador =", count, "// Posições que têm 1:", usedPositions)
    return parity

def getSlotsFromBinary(string):
    #Simples função para obter os valores das posições que são potência de dois
    slots = []
    for i in range(len(string)):
        if(isPowerOfTwo(i+1)):
           slots.append(string[i])
    return slots

def receiveAndVerify(binary, parityUsed):

    #Aplicação do algoritmo de verificação de Hamming em si
    #Para cada posição onde o índice for potência de dois, será obtida a paridade e uma nova palavra será formada com tais bits
    #Se os bits da verificação não condizerem com os bits retirados da palavra original, há algum erro e tal será obtido pela soma das potências de dois onde houve erro

    slotsToVerify = getSlotsFromBinary(binary)
    parityBits = []
    result = []
    wrongBits = []
    for i in range(len(binary)):
        valueToAdd = binary[i]
        if(isPowerOfTwo(i+1)):
            valueToAdd = getParity(i+1, binary, parityUsed)
            parityBits.append(str(valueToAdd))
        result.append(str(valueToAdd))

    if(len(parityBits) != len(slotsToVerify)):
        return "Quantidade de bits de verificação não conferem!\n"
    else:
        for i in range(len(parityBits)):
            if(parityBits[i] != slotsToVerify[i]):
               wrongBits.append(listOfPowerOfTwo[i])
        if(len(wrongBits) > 0):
            return ("Há um bit errado na transmissão, sendo este: %d\n") % (sum(wrongBits))
        else:
            return "Não há bits errados e a palavra foi recebida com sucesso!\n"

def getBinaryWithSlots(string):
    #Aqui uso um caractere de escape X para inserir na palavra a ser transmitida em cada posição potência de dois enquanto não verifico a paridade
    binary = []
    stringCounter = 0
    quantity = getQuantityToIncrement(string)
    print("Incrementando", quantity, "em", string)
    for i in range(len(string) + quantity):
        if(isPowerOfTwo(i+1)):
            binary.append("X")
        else:
            binary.append(string[stringCounter])
            stringCounter+=1
    return binary

def transmit(binary, usingEven):
    #Aplicação da transmissão via algoritmo de Hamming, onde há o caractere de escape X será adicionado o correspondente bit de paridade
    binaryWithSlots = getBinaryWithSlots(binary)
    result = []
    parityBits = []
    for i in range(len(binaryWithSlots)):
        valueToAdd = binaryWithSlots[i]
        if(valueToAdd == 'X'):
            valueToAdd = getParity(i+1, binaryWithSlots, usingEven)
            parityBits.append(str(valueToAdd))
        result.append(str(valueToAdd))
    return "\nObtive " + "".join(parityBits) + " como bits de paridade, na ordem " + "e " + "".join(result) + " como palavra final\n"


def makeAnError(binary, position):
    array = []
    for i in range(len(binary)):
        toAdd = binary[i]
        if(i == position):
            toAdd = "0" if (toAdd == "1") else "1"
        array.append(toAdd)
    return "".join(array)


def main():
    while(True):

        binary = input("Digite a palavra (em binário) a ser usada no programa\nou apenas 0 para encerrar: ")

        if(binary == "0"):
            break

        isEven = input("Usando paridade par ou ímpar? P/I = ")

        while(True):
            if(isEven == "P" or isEven == "p"):
                isEven = True
                break
            elif(isEven == "I" or isEven == "i"):
                isEven = False
                break
            else:
                isEven = input("Digite uma paridade válida! P/I = ")

        operationToDo = input("Deseja transmitir ou receber a palavra? T/R = ")

        while(True):
            if(operationToDo == "T" or operationToDo == "t"):
                print(transmit(binary, isEven))
                break
            elif(operationToDo == "R" or operationToDo == "r"):
                positionToBreak = input("Deseja causar algum erro? Se sim, digite a posição, caso contrario digite N: ")
                if(positionToBreak != "N" and positionToBreak != "n"):
                    binary = makeAnError(binary, int(positionToBreak)-1)
                    print("Erro causado, agora usando a sequência", binary)
                print(receiveAndVerify(binary, isEven))
                break
            else:
                operationToDo = input("Digite uma operação válida! T/R = ")

main()
