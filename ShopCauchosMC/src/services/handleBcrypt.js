import bcrypt from 'bcryptjs'

export const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain, 10)
    return hash
}
export const compare = async (passPlain, hashPass) =>{
    return await bcrypt.compare(passPlain, hashPass)
}
