// query.js
import { PrismaClient } from '@prisma/client';
import { PrismaStylusDBSQL } from 'stylusdb-sql-prisma-adapter';
import net from 'net';
import dotenv from 'dotenv';

// setup
dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const client = new Client(connectionString)
const adapter = new PrismaStylusDBSQL(client, {})
const prisma = new PrismaClient({ adapter })

async function main() {
    await client.connect();
    const rawQueryData = await prisma.$queryRaw`SELECT id from student`;
    console.log({ rawQueryData });
    const student = await prisma.student.create({
        data: {
            name: 'test',
            age: '28',
        },
    }).catch((e) => {
        console.log(e)
    });
    console.log(student);

    const students = await prisma.student.findMany();
    console.log(students);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
