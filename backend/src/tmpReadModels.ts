import client from "./repositories/client";

const getAll = async () => {
    try {
        return await client.model.findMany()
    } catch (e) {
        console.error('Error fetching validationModels!');
        throw e;
    } finally {
        await client.$disconnect();
    }
}

getAll()
    .then((models) => {
        console.log("All validationModels:", models)
    })
    .catch((_) => {
    console.error("Error!")
    });
