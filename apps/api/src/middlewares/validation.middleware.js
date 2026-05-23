export const validate = (schema) => (req, res, next)=> {
    const result = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
    });
    next()
}