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
            role: "ADMIN",
            board: ["RECURSOS_HUMANOS", 'FINANCEIRO', 'COMUNICACAO', 'AUTOMAÇÃO_E_ROBOTICA', 'SISTEMAS_E_INTELIGENCIA', 'INOVAÇÃO_TRANSDISCIPLINAR'],
            club: ['DES_WEB_1', 'DES_WEB_2', 'DES_WEB_3', 'HACKATHON', 'MIDIA', 'ATUALIDADES', 'VIS_COMPUTACIONAL_1', 'VIS_COMPUTACIONAL_2', 'ROBOTICA_1', 'ROBOTICA_2', 'ROBOTICA_3', 'TEC_EDUCACIONAL_1', 'TEC_EDUCACIONAL_2', 'AEROMODELISMO', 'MUSICA', 'ESCRITA_CRIATIVA', 'DNA_EM_EVIDENCIA', 'IDENTIDADE_E_TECNOLOGIA', 'PROCESSAMENTO_DE_SINAIS'],
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