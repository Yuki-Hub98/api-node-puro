const http = require('http');
const PORT = 3000;
const server = http.createServer((req, res) => {

    const entregas = [
        { id: 1, motorista: 'Carlos', status: 'em_rota', veiculo: 'Caminhão 01' },
        { id: 2, motorista: 'Ana', status: 'entregue', veiculo: 'Van 03' },
        { id: 3, motorista: 'João', status: 'pendente', veiculo: 'Caminhão 02' },
        { id: 4, motorista: 'Carlos', status: 'em_rota', veiculo: 'Van 01' }
    ];

    const {method, url} = req;

    const urlObj = new URL(req.url, `http://${req.headers.host}`);

    console.log(`Método: ${method} | URL: ${urlObj.pathname}`);

    if (urlObj.pathname === "/") {
        res.end('Servidor ativo');
    }

    switch (method) {
        case "GET":
            if (urlObj.pathname === "/entregas") {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(entregas));
                break;
            } else if (urlObj.pathname === "/entregas/ativas") {
                const entregasAtivas = entregas.filter(
                    entrega => entrega.status === 'em_rota'
                );

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(entregasAtivas));
                break;
            } else if (urlObj.pathname === "/entregas/resumo") {
                const resumo = entregas.map(entrega => ({
                    id: entrega.id,
                    status: entrega.status
                }));

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(resumo));
                break;
            } else if(urlObj.pathname === "/motoristas" && urlObj.search){
            
                const motoristaNome = urlObj.searchParams.get("nome");

                const entregasMotorista = entregas.filter(
                    entrega => entrega.motorista.toLowerCase() === motoristaNome.toLowerCase()
                );

                console.log(entregasMotorista);

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(entregasMotorista));
                break;
            } else if (urlObj.pathname === "/motoristas") {
                const motoristas = entregas.map(entrega => entrega.motorista).filter((motorista, index, array) => {
                    return array.indexOf(motorista) === index;
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(motoristas));
                break;
            } else if (urlObj.pathname === "/relatorio") {
                const total = entregas.length;
                const emRota = entregas.filter(e => e.status === 'em_rota').length;
                const entregues = entregas.filter(e => e.status ===
                'entregue').length;

                const relatorio = {
                    total,
                    emRota,
                    entregues
                };

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(relatorio));
                break;
            } else if(urlObj.pathname === "/pendentes"){
                const entregasPendentes = entregas.filter(
                    entrega => entrega.status === 'pendente'
                );

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(entregasPendentes));
                break;
            } else if (urlObj.pathname === "/status-entregas") {
                const totaisPorMotorista = {};

                entregas.forEach(entrega => {
                    if (!totaisPorMotorista[entrega.motorista]) {
                        totaisPorMotorista[entrega.motorista] = 1;
                    } else {
                        totaisPorMotorista[entrega.motorista]++;
                    }
                });

                let motoristaTop = null;
                let maiorTotal = 0;

                for (const motorista in totaisPorMotorista) {
                    if (totaisPorMotorista[motorista] > maiorTotal) {
                        maiorTotal = totaisPorMotorista[motorista];
                        motoristaTop = motorista;
                    }
                }

                const relatorioMotoristas = {
                    totais: totaisPorMotorista,
                    motoristaComMaisEntregas: motoristaTop,
                    totalDeEntregas: maiorTotal
                };

                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(relatorioMotoristas));

            } else{
                res.writeHead(404, {"content-type": "text/plain"});
                res.end("404 Not Found.")
                break;
            }
            break;
        default:
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found.")
            break;
    }


});
server.listen(PORT, () => {
    console.log(`Monitoramento Logístico está rodando na porta: ${PORT}`)
});