import { PrismaClient, TransactionType } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashPassword = await hash('senha@senha', 10);

  // Criando 5 usuários de exemplo
  const user1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: hashPassword,
      balance: 1000,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      password: hashPassword,
      balance: 1500,
      role: 'USER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Carlos Souza',
      email: 'carlos.souza@example.com',
      password: hashPassword,
      balance: 2000,
      role: 'USER',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Ana Pereira',
      email: 'ana.pereira@example.com',
      password: hashPassword,
      balance: 2500,
      role: 'USER',
    },
  });

  const user5 = await prisma.user.create({
    data: {
      name: 'Lucas Santos',
      email: 'lucas.santos@example.com',
      password: hashPassword,
      balance: 3000,
      role: 'USER',
    },
  });

  // Criando 15 transações de exemplo (3 tipos de transação)
  await prisma.transaction.createMany({
    data: [
      // Depósitos
      { type: TransactionType.DEPOSIT, amount: 500, userId: user1.id },
      { type: TransactionType.DEPOSIT, amount: 600, userId: user2.id },
      { type: TransactionType.DEPOSIT, amount: 700, userId: user3.id },
      { type: TransactionType.DEPOSIT, amount: 800, userId: user4.id },
      { type: TransactionType.DEPOSIT, amount: 900, userId: user5.id },

      // Saques
      { type: TransactionType.WITHDRAWAL, amount: 200, userId: user1.id },
      { type: TransactionType.WITHDRAWAL, amount: 300, userId: user2.id },
      { type: TransactionType.WITHDRAWAL, amount: 400, userId: user3.id },
      { type: TransactionType.WITHDRAWAL, amount: 500, userId: user4.id },
      { type: TransactionType.WITHDRAWAL, amount: 600, userId: user5.id },

      // Transferências
      {
        type: TransactionType.TRANSFER,
        amount: 150,
        userId: user1.id,
        targetUserId: user2.id,
      },
      {
        type: TransactionType.TRANSFER,
        amount: 200,
        userId: user2.id,
        targetUserId: user3.id,
      },
      {
        type: TransactionType.TRANSFER,
        amount: 250,
        userId: user3.id,
        targetUserId: user4.id,
      },
      {
        type: TransactionType.TRANSFER,
        amount: 300,
        userId: user4.id,
        targetUserId: user5.id,
      },
      {
        type: TransactionType.TRANSFER,
        amount: 350,
        userId: user5.id,
        targetUserId: user1.id,
      },
    ],
  });

  console.log('Usuários e transações de exemplo inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
