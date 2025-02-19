<template>
  <div class="hidden">
    <vs-navbar fixed shadow square v-model="active">
      <template #left>
        <vs-button @click="activeSidebar = !activeSidebar" flat icon>
          <box-icon name='menu'></box-icon>
        </vs-button>
          <box-icon name='last-page'></box-icon> {{ breadcrumb }} /
      </template>
      
      <vs-navbar-item >
          <router-link to="/home" class="nav-link">
            &nbsp;
          </router-link>
        </vs-navbar-item>
        <vs-navbar-item :active=" isActive('/llegada')" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ENTRADAS', 'CONFIRMA ORDEN'].includes(role))" id="llegada">
          <router-link to="/llegada" class="nav-link">
              <box-icon name='grid-alt'></box-icon> Llegada
          </router-link>
        </vs-navbar-item>
        <vs-navbar-item :active=" isActive('/procesoPrendas')" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'PROCESO PRENDAS'].includes(role))" id="procesoPrendas">
          <router-link to="/procesoPrendas" class="nav-link">
              <box-icon name='briefcase'></box-icon> Proceso Prendas
          </router-link>
        </vs-navbar-item>
        <vs-navbar-item :active=" isActive('/entregas')" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ENTREGAS'].includes(role))" id="entregas">
          <router-link to="/entregas" class="nav-link">
              <box-icon name='shopping-bag'></box-icon> Entregas
          </router-link>
        </vs-navbar-item>


      <template #right>
        <vs-navbar-item>
          <box-icon name='street-view'></box-icon> | {{ userName }}
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'exit'" id="exit" @click="logoutModal=!logoutModal">
            <box-icon name='exit' ></box-icon>
        </vs-navbar-item>
      </template>
    </vs-navbar>
    <vs-sidebar fixed :open.sync="activeSidebar">
      <template #logo>
          <img src="@/assets/logo_coeli.png" alt="urvina-coeli">
      </template>
      
      <vs-sidebar-item  :class="{ 'active': isActive('/home') }"  id="home">
        <template #icon>
          <box-icon name='home-alt-2' ></box-icon>
        </template>
        <router-link to="/home" class="nav-link">
          Home
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item  :class="{ 'active': isActive('/dashboard') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'DASHPROD'].includes(role))" id="dashboard">
        <template #icon>
          <box-icon name='line-chart'></box-icon>
        </template>
        <router-link to="/dashboard" class="nav-link">
          Dashboard
        </router-link>
      </vs-sidebar-item>
      
      <vs-sidebar-item :class="{ 'active': isActive('/usuarios') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'USUARIOS'].includes(role))" id="usuarios">
        <template #icon>
          <box-icon name='user'></box-icon>
        </template>
        <router-link to="/usuarios" class="nav-link active"  >
          usuarios
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item :class="{ 'active': isActive('/clientes') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CLIENTES'].includes(role))" id="clientes">
        <template #icon>
          <box-icon type='solid' name='user-badge'></box-icon>
        </template>
        <router-link to="/clientes" class="nav-link">
          Clientes
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item :class="{ 'active': isActive('/busqueda') }" id="busqueda">
        <template #icon>
          <box-icon name='search-alt-2' ></box-icon>
        </template>
        <router-link to="/busqueda" class="nav-link">
          Busqueda Rutas
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item :class="{ 'active': isActive('/tipoLavados') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'LAVADORA'].includes(role))" id="tipoLavados">
        <template #icon>
          <box-icon name='water'></box-icon>
        </template>
        <router-link to="/tipoLavados" class="nav-link">
          Tipo Lavados
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item :class="{ 'active': isActive('/lavadoras') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'LAVADORA'].includes(role))" id="lavadoras">
        <template #icon>
          <box-icon type='solid' name='washer'></box-icon>
        </template>
        <router-link to="/lavadoras" class="nav-link">
          Lavadoras
        </router-link>
      </vs-sidebar-item>
      
      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <box-icon name='folder-open'></box-icon>
            </template>
            Procesos
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item :class="{ 'active': isActive('/registroLavado') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'PROCESO LAVADO'].includes(role))" id="registroLavado">
          <template #icon>
            <box-icon type='solid' name='file-plus'></box-icon>
          </template>
          <router-link to="/registroLavado" class="nav-link">
            Registrar Proceso de Lavado
          </router-link>
        </vs-sidebar-item>
  
        <vs-sidebar-item :class="{ 'active': isActive('/procesoLavado') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'PROCESO LAVADO'].includes(role))" id="procesoLavado">
          <template #icon>
            <box-icon type='solid' name='file-plus'></box-icon>
          </template>
          <router-link to="/procesoLavado" class="nav-link">
            Proceso de Lavado
          </router-link>
        </vs-sidebar-item>

      </vs-sidebar-group>


      <vs-sidebar-item :class="{ 'active': isActive('/prendas') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'PRENDA'].includes(role))" id="prendas">
        <template #icon>
          <box-icon name='body'></box-icon>
        </template>
        <router-link to="/prendas" class="nav-link">
          Prendas
        </router-link>
      </vs-sidebar-item>
      
      
      
      <vs-sidebar-group>
          <template #header>
            <vs-sidebar-item arrow>
              <template #icon>
                <box-icon name='folder-open'></box-icon>
              </template>
              ordenes
            </vs-sidebar-item>
          </template>

          <vs-sidebar-item :class="{ 'active': isActive('/rastreo') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'RASTREO'].includes(role))" id="rastreo" >
            <template #icon>
              <box-icon name='map-pin'></box-icon>
            </template>
            <router-link to="/rastreo" class="nav-link">
                Rastreo Ordenes
            </router-link>
          </vs-sidebar-item>

          <vs-sidebar-item :class="{ 'active': isActive('/ordenes') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))" id="ordenes">
            <template #icon>
              <box-icon name='folder-open'></box-icon>
            </template>
            <router-link to="/ordenes" class="nav-link">
              Historial ordenes
            </router-link>
          </vs-sidebar-item>

          <vs-sidebar-item :class="{ 'active': isActive('/historico') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'HISTORIAL LAVADO'].includes(role))" id="rastreo" >
            <template #icon>
              <box-icon name='book-reader'></box-icon>
            </template>
            <router-link to="/historico" class="nav-link">
                Historico de Ordenes
            </router-link>
          </vs-sidebar-item>
          
          <vs-sidebar-item :class="{ 'active': isActive('/canceladas') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" id="canceladas">
            <template #icon>
              <box-icon name='folder-minus'></box-icon>
            </template>
            <router-link to="/canceladas" class="nav-link">
                Ordenes canceladas
            </router-link>
          </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group>
          <template #header>
            <vs-sidebar-item arrow>
              <template #icon>
                <box-icon name='cog'></box-icon>
              </template>
              Herramientas
            </vs-sidebar-item>
          </template>

          <vs-sidebar-item :class="{ 'active': isActive('/roles') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ROLES'].includes(role))" id="roles" >
            <template #icon>
              <box-icon name='toggle-right' ></box-icon>
            </template>
            <router-link to="/roles" class="nav-link">
                Roles de usuario
            </router-link>
          </vs-sidebar-item>
    
          <vs-sidebar-item :class="{ 'active': isActive('/reportes') }" v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'REPORTES'].includes(role))" id="reportes" >
            <template #icon>
              <box-icon name='folder'></box-icon>
            </template>
            <router-link to="/reportes" class="nav-link">
                Reportes
            </router-link>
          </vs-sidebar-item>

          <vs-sidebar-item id="cambioNip">
            <template #icon >
              <box-icon name='dialpad-alt'  @click="passModal"></box-icon>
            </template>
            <b @click="passModal">Cambio de NIP</b>
          </vs-sidebar-item>
          
      </vs-sidebar-group>


      <vs-dialog prevent-close v-model="activeModal">
        <template #header>
          <h4 class="not-margin">
            ¿Seguro que deseas Cabiar tu<b> Contraseña?</b>
          </h4>
        </template>
          <template>
              <div class="con-form">
                <b-row>
                  <b-col lg="12" md="12" sm="12">
                    <vs-input p class="mb-3" pattern="[0-9]*" inputmode="numeric"  primary type="password" v-model="passNueva" label-placeholder="Contraseña Nueva">
                      <template #icon>
                        <box-icon type='solid' name='lock-open'></box-icon>
                      </template>
                    </vs-input>
                  </b-col>
                  <b-col lg="12" md="12" sm="12">
                    <vs-input  class="mb-3"  pattern="[0-9]*" inputmode="numeric" primary type="password" v-model="passConf" label-placeholder="Confirmar Contraseña">
                      <template #icon>
                        <box-icon type='solid' name='lock-open'></box-icon>
                      </template>
                    </vs-input>
                  </b-col>
                  <b-col lg="12" md="12" sm="12">
                    <vs-input class="mb-3"  pattern="[0-9]*" inputmode="numeric" primary type="password" v-model="passAct" label-placeholder="Contraseña Actual">
                      <template #icon>
                        <box-icon type='solid' name='lock'></box-icon>
                      </template>
                    </vs-input>
                  </b-col>
                </b-row>
              </div>
          </template>

          <template #footer>
            <div class="footer-dialog">
              <vs-button primary block @click="actualizarPassword()">
                  <box-icon name='save' color="#fff"></box-icon> Actualizar
              </vs-button>
            </div>
          </template>
      </vs-dialog>
      
      
    </vs-sidebar>
    <vs-dialog prevent-close v-model="logoutModal">
      <template #header>
        <h4 class="not-margin">
          ¿Seguro que deseas <b>cerrar sesión?</b>
        </h4>
      </template>
      <template #footer>
        <div class="footer-dialog">
          <div class="d-flex flex-row bd-highlight">
              <div class="p-1 bd-highlight">
                <vs-button size="xl" block  @click="logout()"> Si, Salir </vs-button>
              </div>
              <div class="p-1 bd-highlight">
                <vs-button size="xl" danger block  @click="logoutModal=!logoutModal">No, Cancelar</vs-button>
              </div>
          </div>
        </div>
      </template>
    </vs-dialog>
  </div>

</template>

<script>
export default {
  name: 'HeaderComponent',
  data:() => ({
    userName: '',
    logoutModal: false,
    activeModal: false,
    passNueva: '',
    passConf: '',
    passAct: '',
    breadcrumb: '',
    active: 'home',
    activeSidebar: false,
    activeNotify: false,

    formProceso: false,
    url: process.env.VUE_APP_SERVICE_URL_API
  }),
  mounted(){
    this.userName = this.$session.get('username')
    this.breadcrumb = window.location.pathname.split("/")[1]
  },
  methods:{
    
    async actualizarPassword(){
      let token = this.$session.get('token')

      let json = {
          "idUsuario": this.$session.get('idUsuario'),
          "password": this.passNueva,
          "confirmPassword": this.passConf,
          "actualPassword": this.passAct
      };
      
      let res = await fetch(this.url+"usuario/changePassword",{
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': "*",
              'Authorization': token
          },
          body: JSON.stringify(json)
      })
      let data = await res.json()
      if(data.status == 200){
          this.activeModal = false
          this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
      }else{
          this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

      }
    },
    passModal(){
      console.log("click")
      this.activeModal = true
    },
    isActive(route) {
      return this.$route.path == route;
    },
    logout(){
      this.$session.destroy();
      this.$router.push('/login');
      // location.reload();
    },
    openNotification( title, text, color, position = null, icon) {
      this.$vs.notification({
        progress: 'auto',
        icon,
        color,
        position,
        title: title,
        text: text
      })
    }
  }
}
</script>
<style lang="stylus">
getColor(vsColor, alpha = 1)
    unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")
.not-margin
  margin 0px
  font-weight normal
  padding 10px
.con-form
  width 100%
  .flex
    display flex
    align-items center
    justify-content space-between
    a
      font-size .8rem
      opacity .7
      &:hover
        opacity 1
  .vs-checkbox-label
    font-size .8rem
  .vs-input-content
    margin 10px 0px
    width calc(100%)
    .vs-input
      width 100%
.footer-dialog
  display flex
  align-items center
  justify-content center
  flex-direction column
  width calc(100%)
  .new
    margin 0px
    margin-top 20px
    padding: 0px
    font-size .7rem
    a
      color getColor('primary') !important
      margin-left 6px
      &:hover
        text-decoration underline
  .vs-button
    margin 0px
</style>
