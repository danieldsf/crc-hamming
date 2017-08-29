sequencia = '11101'
# print(sequencia)
bit1 = '0'
bit2 = '0'
bit4 = '0'
sequenciaInicial = bit1 + bit2 +  sequencia[0] + bit4 + sequencia[1:]
print(sequenciaInicial + '==' + '00101101')

for i in range(len(sequenciaInicial) - 1):
	print (sequenciaInicial[i])