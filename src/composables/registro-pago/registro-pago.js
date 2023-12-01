import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useRegistroPago = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const cliente = ref({});
    const clientes = ref([]);
    const prestamos = ref([]);
    const prestamo = ref({})
    const cuotas = ref([]);
    const cuota = ref({});

    const buscarClientesPrestamo = async(data) => {

        let respond = await prestamoApi.get('/api/registro-pagos/buscar-clientes?buscar='+data,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            clientes.value = jwtDecode(respond.data).clientes;
        }
    }

    const seleccionarCliente =async(data) => {
        let respond = await prestamoApi.get('/api/registro-pagos/buscar-clientes?buscar='+data,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            clientes.value = jwtDecode(respond.data).clientes;
        }
    }

    const listarPrestamosCliente = async(id) => {
        let respond = await prestamoApi.get('/api/prestamos/list-by-cliente?cliente_id='+id,config)
        prestamos.value = jwtDecode(respond.data).prestamos
    }

    const listarCuotasPrestamo = async(id) => {
        let respond = await prestamoApi.get('/api/cuotas/list-by-prestamo?prestamo_id='+id,config)
        cuotas.value = jwtDecode(respond.data).cuotas
    }

    return {
        errors, respuesta, clientes, prestamos, cliente, cuotas, prestamo, cuota,
        buscarClientesPrestamo, listarPrestamosCliente, listarCuotasPrestamo
    }
}