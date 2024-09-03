const HttpCode200 = (res, data) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

const HttpCode400 = (res, error) => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(error));
};

const HttpCode404 = (res, error) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(error));
};


module.exports = {HttpCode200: HttpCode200,write400: HttpCode400,write404: HttpCode404};