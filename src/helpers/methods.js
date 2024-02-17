import {jwtDecode } from 'jwt-decode';
import { inject } from 'vue';


export const defineTitle = (title) => {
    document.title =title + ' | PRESTAMOS'
}

export const getdataParamsPagination = ( data) => {
    return "?page=" + data.page + "&paginacion="+ data.paginacion + "&buscar=" +data.buscar;
}

export const getdataParamsPaginationByUser = ( data) => {
    let usuario = jwtDecode(localStorage.getItem('token-api')).user ?? null;
    
    let user = (usuario) ? usuario.id : ""
    let role = (usuario) ? usuario.roles[0].slug : ""
    return "?page=" + data.page + "&paginacion="+ data.paginacion + "&buscar=" +data.buscar
            +"&user="+user+"&role="+role;
}

export const getdataParamsPaginationByRoleUser = ( data) => {
    
    return "?page=" + data.page + "&paginacion="+ data.paginacion + "&buscar=" +data.buscar
            +"&user="+data.user+"&role="+data.role+'&lider='+data.lider;
}

export const getConfigHeader = () => {

    if(localStorage.getItem('token-api'))
    {
        let decode =  jwtDecode(JSON.parse(localStorage.getItem('token-api')||null))

        let token = decode.token

        return {
            headers:{
                'Authorization': 'JWT ' + token
            }
        }
    }
}

export const getConfigHeaderPost = () => {
    if(localStorage.getItem('token-api'))
    {
        let decode =  jwtDecode(JSON.parse(localStorage.getItem('token-api')||null))

        let token = decode.token

        return {
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'JWT ' + token
            }
        }
    }
}

export const getConfigHeaderUpload = () => {

    if(localStorage.getItem('token-api'))
    {
        let decode =  jwtDecode(JSON.parse(localStorage.getItem('token-api')||null))

        let token = decode.token

        return {
            headers:{
                'Authorization': 'JWT ' + token,
                'Content-Type': 'multipart/form-data'
            }
        }
    }
}

export const useHelper = () => {
    const Swal = inject('Swal');

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    const soloNumeros = (evt) => {
        evt = (evt) ? evt : window.event
        var charCode = (evt.which) ? evt.which : evt.keyCode

        if((charCode > 31 && (charCode< 48 || charCode > 57)) && charCode !=48 )
        {
            evt.preventDefault()
        } else {
            return true
        }
    }

    return {
        Swal, Toast, soloNumeros
    }
}