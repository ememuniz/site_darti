import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } })

    if (existingAdmin) { 
        console.log("Administrador já foi cadastrado.", existingAdmin.email);
        return; 
    }

    const hashedPassword = await bcrypt.hash("admin123", 10)

    const admin = await prisma.user.create({
        data: {
            name: "Administrador",
            email: "admin@darti.ufma.br",
            password: hashedPassword,
            role: "ADMIN"
        }
    })

    console.log("Administrador cadastrado com sucesso:", admin.email);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(
        async () => { await prisma .$disconnect() } //esse $disconnect() é necessário para que o processo do seed seja finalizado corretamente, caso contrário ele fica rodando indefinidamente
    )