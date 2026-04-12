import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Chesslines server running on port ${PORT}`);
});
