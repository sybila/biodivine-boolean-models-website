import {Request, Response, Router} from "express";
import path from "path";
import {exec} from "child_process";
import {seed} from "../seed";
import {GitPushEvent} from "../types";

const webhookRouter = Router();
const webhookRoute = "/webhook";

webhookRouter.post(webhookRoute, (req: Request, res: Response) => {
    const repoPath = path.resolve(__dirname) // There will be adjustment needed when transferred to other machine
    exec('git pull origin main', {cwd: repoPath}, (error) => {
        if (error) {
            res.status(500).send("Error pulling new changes");
        } else {
            console.log("New changes pulled successfully!!!"); // Might as well comment this line
            console.log(req.body.size)
            const changes: GitPushEvent = req.body;
            console.log("here im");

            if (changes.ref === 'refs/heads/main') {
                const modelChanges = changes.commits[0].added.concat(changes.commits[0].modified);
                if (modelChanges.some((change: string) => change.startsWith('models/'))) {
                    seed().then((_) => {
                        res.status(200).send("Models uploaded successfully");
                    });
                }
            }
        }
    })
});

export default webhookRouter;
