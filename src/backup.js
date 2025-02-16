export default {
    async fetch(request, env) {

        const url = new URL(request.url);
        const question = url.searchParams.get("question");
        const tasks = [];

        // prompt - simple completion style input
        let simple = {
            prompt: question
        };
        // let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', simple);
        // tasks.push({ inputs: simple, response });

        // messages - chat style input
        let chat = {
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: question }
            ]
        };
        let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
        tasks.push({ inputs: chat, response });

        return Response.json(tasks);
    }
};