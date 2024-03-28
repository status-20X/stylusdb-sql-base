const readCSV = require('../../src/csvReader');
const {parseQuery} = require('../../src/queryParser');

test('Read CSV File', async () => {
    const data = await readCSV('./student.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(4);
    expect(data[0].name).toBe('John');
    expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
});

test('Parse SQL Query', () => {
    const query = 'SELECT id, name FROM sample';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        joinType: null, // Add the joinType property with a value of null
        joinTable: null,
        joinCondition: null,
        whereClauses: [],
        groupByFields: null, // Add the groupByFields property with a value of null
        hasAggregateWithoutGroupBy: false // Add the hasAggregateWithoutGroupBy property with a value of false
    });
});
