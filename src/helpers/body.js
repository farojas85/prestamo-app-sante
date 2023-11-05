export const cargarClasesLoginLayout = () => {
    const partBody = document.body
    if(partBody)
    {
        partBody.classList.remove('sidebar-mini');
        partBody.classList.remove('layout-fixed');
        partBody.classList.add('login-page');
    }
}

export const cargarClasesDefaultLayout = () => {
    const partBody = document.body
    if(partBody)
    {
        partBody.classList.remove('login-page');
        partBody.classList.add('sidebar-mini');
        partBody.classList.add('layout-fixed');
    }
}