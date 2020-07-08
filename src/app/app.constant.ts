import { Role } from './service/login.service'

export const API_URI = 'http://192.168.0.201:3558/'
export const DATE_FORMAT = 'yyyyMMddHHmmss'
export const CLIENT_CART = 'CLIENT_CART'
export const CLIENT = 'CLIENT'
export const USER = 'USER'

export const Status = {
    PENDING : 'Pending',
    CONFIRM : 'Confirm',
    KITCHEN : 'Kitchen',
    DELIVER : 'Deliver',
    FINISHED : 'Finished',
    CANCELLED : 'Cancelled'
}

export let userRole : Role;

