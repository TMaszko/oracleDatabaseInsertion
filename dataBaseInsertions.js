const fs = require('fs');


const disableConstraintsConfig = [{constraintName: "do_kocurow_szef_bandy", table:'Bandy'},{constraintName: 'do_kocurow_szef', table: 'Kocury'} ]
const disableConstraintSQL = ( acc, { constraintName, table }) => `${acc}ALTER TABLE ${table} DISABLE CONSTRAINT ${constraintName}\n`
const disableContraints = disableConstraintsConfig.reduce(disableConstraintSQL,'')
const insertAllSQL = 'INSERT ALL'
const intoSQL = 'INTO'
const valuesSQL = 'VALUES'
const insertIntoSQL = schema => (acc, data) => `${acc}${intoSQL} ${schema} ${valuesSQL} \(${data.replace('\r','')}\)\n`
const data = [ 
	fs.readFileSync('bandy.txt','UTF-8'),
	// fs.readFileSync('funkcje.txt', 'UTF-8'),
	// fs.readFileSync('wrogowie.txt', 'UTF-8'),
	// fs.readFileSync('kocury.txt', 'UTF-8'),
	// fs.readFileSync('wrogowie_kocurow.txt', 'UTF-8')
]
const insertIntoValuesSQL = (data, schema) =>
	data.split('\n')
		.filter(row => row.length !== 0)
		.reduce(insertIntoSQL(schema), '')

const schemas = [
	'Bandy (nr_bandy,nazwa,teren,szef_bandy)',
	// 'Funkcje (funkcja,min_myszy,max_myszy)',
	// 'Wrogowie (imie_wroga,stopien_wrogosci,gatunek,lapowka)',
	// 'Kocury (imie,plec, psuedo, funkcja, szef, w_statku_od, przydzial_myszy, myszy_extra, nr_bandy)',
	// 'Wrogowie_Kocurow (pseudo,imie_wroga,data_incydentu,opis_incydentu)'
]

const SQLquery = data.map((data, i) => insertIntoValuesSQL(data,schemas[i])).join('\n')

const output = `${disableContraints}\n${insertAllSQL}\n${SQLquery}\nSELECT * FROM dual`

fs.writeFileSync('output.txt', output);


