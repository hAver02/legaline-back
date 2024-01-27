// import { transporter } from "./mailer";
const { getDate, getMonth, getHours, getMinutes, subDays} = require('date-fns')
const cron = require('node-cron')
const transporter= require('./mailer')
const { config } = require('./../config/config')


const formatCronDate = (fecha) => {
    const dia = getDate(fecha)
    const mes = getMonth(fecha) + 1
    const hora = getHours(fecha)
    const minutos = getMinutes(fecha)
    const diaCompleto = {dia, mes, hora, minutos} 
    return diaCompleto
}

const diaAnterior = (fecha) =>{
    const diaAnt = subDays(fecha, 1);
    const dia = getDate(diaAnt)
    const mes = getMonth(diaAnt) + 1
    return { dia, mes }
}



const sendAlarmEmail = (notificacion, emailTo) => {
    // console.log('notificacion', notificacion);
    const dc = formatCronDate(notificacion.vencimiento)

    cron.schedule(` ${dc.minutos} ${dc.hora} ${dc.dia} ${dc.mes}  * `, async () => {

        const infoMail = await transporter.sendMail({
        from : config.email,
        to : emailTo,
        subject : 'AVISO VENCIMIENTO ALARMA',
        text : `Desde Legal-Line Chat, le avisamos que su alarma ${notificacion.mensaje} acaba de vencer.`
    })

    })
    const newMinutes = dc.minutos - 2 ;
    const diaAnt = diaAnterior(notificacion.vencimiento) 
    if(dc.hora >= 0 && dc.hora < 11){
        
        cron.schedule(` 0 20 ${diaAnt.dia} ${diaAnt.mes}  * `, async () => {
            const infoMail = await transporter.sendMail({
            from : config.email,
            to : emailTo,
            subject : 'AVISO VENCIMIENTO ALARMA',
            text : `Desde Legal-Line Chat, le avisamos que su alarma ${notificacion.mensaje} esta por vencer.`
        })
    
        })
    }else{
        
        cron.schedule(` 0 8 ${dc.dia} ${dc.mes}  * `, async () => {

            const infoMail = await transporter.sendMail({
            from : config.email,
            to : emailTo,
            subject : 'AVISO VENCIMIENTO ALARMA',
            text : `Desde Legal-Line Chat, le avisamos que su alarma ${notificacion.mensaje} esta por vencer.`
        })
    
        })
    }
}



module.exports = sendAlarmEmail