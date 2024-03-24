// src/index.js

const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    // const { fields, table, whereClauses } = parseQuery(query);
    // const data = await readCSV(`${table}.csv`);

    // src/index.js at executeSELECTQuery

// Now we will have joinTable, joinCondition in the parsed query
const { fields, table, whereClauses, joinTable, joinCondition } = parseQuery(query);
data = await readCSV(`${table}.csv`);

// Perform INNER JOIN if specified
if (joinTable && joinCondition) {
    const joinData = await readCSV(`${joinTable}.csv`);
    data = data.flatMap(mainRow => {
        return joinData
            .filter(joinRow => {
                const mainValue = mainRow[joinCondition.left.split('.')[1]];
                const joinValue = joinRow[joinCondition.right.split('.')[1]];
                return mainValue === joinValue;
            })
            .map(joinRow => {
                return fields.reduce((acc, field) => {
                    const [tableName, fieldName] = field.split('.');
                    acc[field] = tableName === table ? mainRow[fieldName] : joinRow[fieldName];
                    return acc;
                }, {});
            });
    });
}

    //7TH STEP
    // Apply WHERE clause filtering
    // const filteredData = whereClauses.length > 0
    //     ? data.filter(row => whereClauses.every(clause => {
    //         // You can expand this to handle different operators
    //         return row[clause.field] === clause.value;
    //     }))
    //     : data;
    //

    const filteredData = whereClauses.length > 0
    ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
    : data;

    // Select the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}

// src/index.js
function evaluateCondition(row, clause) {
    const { field, operator, value } = clause;
    switch (operator) {
        case '=': return row[field] === value;
        case '!=': return row[field] !== value;
        case '>': return row[field] > value;
        case '<': return row[field] < value;
        case '>=': return row[field] >= value;
        case '<=': return row[field] <= value;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

module.exports = executeSELECTQuery;