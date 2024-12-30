<template>
  <div ref="box">
    <div class="main">
      <div class="right_row">
        <div class="row">
          <div class="publish">
            <div class="publish_textarea">
              <img
                class="border-radius-image"
                src="~assets/sinusuario.png"
                alt=""
              >
              <textarea
                v-model="Post.message"
                type="text"
                placeholder="¿Qué quieres contarnos o sugerir?"
                style="resize: none;"
              />
            </div>
            <div class="publish_footer">
              <div class="block2">
                <select
                  v-model="Post.memo_type"
                  class="select-css"
                >
                  <option value="REMINDER">
                    Recordatorio
                  </option>
                  <option value="CONGRATS">
                    Felicitaciones
                  </option>
                  <option value="ISSUE">
                    Asunto
                  </option>
                  <option value="SUGGEST">
                    Sugerencia
                  </option>
                </select>
              </div>
              <div class="block4">
                <span class="first">
                  <select
                    v-model="Post.typefeed"
                    class="select-css"
                  >
                    <option value="">
                      Público
                    </option>
                    <option value="privado">
                      Privado
                    </option>
                  </select>
                </span>
              </div>
              <div class="block3">
                <button @click="Enviar">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="$store.state.localStorage.user.is_superuser"
          class="filters d-flex justify-content-between"
        >
          <ul class="filters_content">
            <li class="hover-orange selected-orange">
              <b-dropdown
                ref="dropdown"
                variant="light"
                toggle-class="text-dropdown"
                class="shadow-dropdow mr-4 ml-2"
                no-caret
              >
                <template #button-content>
                  <div class="icon">
                    Filtrar
                    <fa-icon
                      :icon="['fas', 'calendar']"
                      class="ml-3"
                    />
                  </div>
                </template>
                <b-dropdown-header>Rango de fechas</b-dropdown-header>
                <b-dropdown-form header="Rango de fechas">
                  <div class="d-flex justify-content-between align-items-center my-2">
                    <label>
                      Desde
                    </label>
                    <input
                      id="example-input"
                      v-model="date_start"
                      type="date"
                      placeholder="YYYY-MM-DD"
                      autocomplete="off"
                      class="ml-2"
                      :max="date_end"
                    >
                  </div>
                  <div class="d-flex justify-content-between align-items-center my-2">
                    <label for="example-input">
                      Hasta
                    </label>
                    <input
                      id="example-input"
                      v-model="date_end"
                      type="date"
                      placeholder="YYYY-MM-DD"
                      autocomplete="off"
                      class="ml-2"
                    >
                  </div>

                  <b-button
                    variant="primary"
                    size="sm"
                    block
                    @click="ListMemos()"
                  >
                    Filtrar
                  </b-button>
                </b-dropdown-form>
              </b-dropdown>
            </li>
          </ul>
        </div>
        <b-overlay
          :show="loading"
          spinner-variant="primary"
          spinner-type="grow"
          spinner-small
          rounded="sm"
        >
          <div
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="scrolldisabled"
            infinite-scroll-distance="25"
          >
            <div
              v-for="(memo, index) in Memos"
              :key="index"
            >
              <div
                v-if="memo.is_private === false || $store.state.localStorage.user.is_superuser || memo.user.id === $store.state.localStorage.user.id"
                class="row border-radius"
              >
                <div
                  v-if="memo.edit"
                  class="publish"
                >
                  <div class="publish_textarea">
                    <img
                      class="border-radius-image"
                      src="~assets/sinusuario.png"
                      alt=""
                    >
                    <textarea
                      v-model="Postedit.message"
                      type="text"
                      placeholder="¿Qué quieres contarnos o sugerir?"
                      style="resize: none;"
                    />
                  </div>
                  <div class="publish_footer">
                    <div class="block2">
                      <select
                        v-model="Postedit.memo_type"
                        class="select-css"
                      >
                        <option value="REMINDER">
                          Recordatorio
                        </option>
                        <option value="CONGRATS">
                          Felicitaciones
                        </option>
                        <option value="ISSUE">
                          Asunto
                        </option>
                        <option value="SUGGEST">
                          Sugerencia
                        </option>
                      </select>
                    </div>
                    <div class="block4">
                      <span class="first">
                        <select
                          v-model="Postedit.typefeed"
                          class="select-css"
                        >
                          <option value="">
                            Público
                          </option>
                          <option value="privado">
                            Privado
                          </option>
                        </select>
                      </span>
                    </div>
                    <div class="block3">
                      <button @click="EditMemo(memo.id)">
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="feed"
                >
                  <div
                    v-if="memo.user.id === $store.state.localStorage.user.id || $store.state.localStorage.user.is_superuser"
                    class="optionpost"
                  >
                    <b-dropdown
                      no-caret
                      variant="transparent"
                      text="..."
                      size="lg"
                    >
                      <b-dropdown-item-button @click="GetMemo(index, memo.id);">
                        <fa-icon
                          :icon="['fas', 'edit']"
                          class="icon"
                        />Editar
                      </b-dropdown-item-button>
                      <b-dropdown-item-button @click="DeleteMemo(memo.id);">
                        <fa-icon
                          :icon="['fas', 'trash']"
                          class="icon"
                          @click="Optionfilter = ''"
                        />Eliminar
                      </b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                  <div class="feed_title">
                    <img
                      :src="userimg"
                      alt=""
                    >
                    <span v-if="!memo.is_unknown">
                      <b v-if="memo.user.first_name">
                        {{ memo.user.first_name }}
                      </b>
                      <b v-else>
                        {{ memo.user.email }}
                      </b> -
                      <fa-icon
                        v-if="memo.memo_type === 'REMINDER'"
                        :icon="['fas', 'bell']"
                        class="icon-color3 drop-ico"
                        title="Recordatorio"
                      />
                      <fa-icon
                        v-if="memo.memo_type === 'CONGRATS'"
                        :icon="['fas', 'trophy']"
                        class="icon-color1 drop-ico"
                        title="Felicitaciones"
                      />
                      <fa-icon
                        v-if="memo.memo_type === 'ISSUE'"
                        :icon="['fas', 'file-signature']"
                        class="icon-color2 drop-ico"
                        title="Incidencia"
                      />
                      <fa-icon
                        v-if="memo.memo_type === 'SUGGEST'"
                        :icon="['fas', 'lightbulb']"
                        class="icon-color4 drop-ico"
                        title="Sugerencia"
                      />
                      <br>
                      <p>{{ DateFormate(memo.created_at) }}</p>
                      <b
                        v-if="memo.is_private"
                        class="private"
                      >
                        Privado
                      </b>
                    </span>
                    <span v-else>
                      <b>
                        Anónimo
                      </b> -
                      <fa-icon
                        v-if="memo.memo_type === 'REMINDER'"
                        :icon="['fas', 'bell']"
                        class="icon-color3 drop-ico"
                        title="Recordatorio"
                      />
                      <fa-icon
                        v-if="memo.memo_type === 'CONGRATS'"
                        :icon="['fas', 'trophy']"
                        class="icon-color1 drop-ico"
                        title="Felicitaciones"
                      />
                      <fa-icon
                        v-if="memo.memo_type === 'ISSUE'"
                        :icon="['fas', 'file-signature']"
                        class="icon-color2 drop-ico"
                        title="Incidencia"
                      />
                      <fa-icon
                        v-if="memo.memo_type === 'SUGGEST'"
                        :icon="['fas', 'lightbulb']"
                        class="icon-color4 drop-ico"
                        title="Sugerencia"
                      /><br>
                      <p>{{ DateFormate(memo.created_at) }}</p>
                    </span>
                  </div>
                  <div class="feed_content">
                    <div class="feed_content_image">
                      <p> {{ memo.message }} </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="loadingscroll"
            class="loading-scroll"
          >
            <div class="spinner-container">
              <b-spinner class="spinner" />
              <p>Cargando Publicaciones...</p>
            </div>
          </div>
          <div
            v-if="EmptyPost"
            class="loading-scroll"
          >
            <div class="spinner-container">
              <p class="empty">
                No existen mas publicaciones
              </p>
            </div>
          </div>
          <div
            v-if="EmptyPost2"
            class="post-empty"
          >
            <div class="spinner-container">
              <p class="empty">
                No existen publicaciones
              </p>
            </div>
          </div>
        </b-overlay>
        <!--
        <center>
          <a href="">
            <div class="loadmorefeed">
              <i class="fa fa-ellipsis-h" />
            </div>
          </a>
        </center>-->
      </div>
      <div class="rules-wall">
        <div class="row border-radius-tags">
          <div class="rules_feed">
            <h2 class="text-left pl-3">
              Normas comunitarias
            </h2>
            <div class="rules_feed_title">
              <ul class="listaruleswall">
                <li>
                  1. Relacionarse en base al respeto y la empatía.
                </li>
              </ul>
              <h4>🚫 No está permitido:</h4>
              <ul class="listaruleswall">
                <li>
                  1. Comportamiento abusivo
                </li>
                <li>
                  2. Comportamiento de odio
                </li>
                <li>
                  3. Desnudos y contenido sexual
                </li>
              </ul>
              <div class="w-100 text-center more">
                <a
                  href="#"
                  @click="modalRulesWall = true"
                >Ver más</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="Backtop"
      class="goTop"
      @click="backToTop"
    >
      <fa-icon :icon="['fa', 'angle-up']" />
    </button>
    <b-modal
      v-model="modalRulesWall"
      hide-footer
      hide-header
      title="Normas comunitarias"
      size="lg"
      modal-class="modal-class"
    >
      <div class="d-block text-center">
        <h4 class="mt-4 mb-3">
          Normas comunitarias
        </h4>
        <ul class="my-4 listaruleswall">
          <li>
            <strong>1. Respeto y empatía:</strong> Formemos una comunidad amable, donde podamos reír, dialogar y compartir en equipo siempre en el márgen del respeto y la empatía.
          </li>
        </ul>
        <h6 class="text-left pl-5">
          <strong>🚫 No está permitido:</strong>
        </h6>
        <ul class="my-4 listaruleswall">
          <li>
            <strong>1. Comportamiento abusivo:</strong> Este es un espacio seguro donde no permitimos expresiones de abuso, incluyendo amenazas o declaraciones degradantes con la intención de burlarse, humillar, avergonzar, intimidar o herir a un miembro del equipo.
          </li>
          <li>
            <strong>2. Comportamiento de odio:</strong> No permitimos publicaciones que ataquen, amenacen, inciten a la violencia de alguna manera a una persona por su raza, etnia, origen nacional, religión, orientación sexual, género, expresión de género, enfermedad, discapacidad.
          </li>
          <li>
            <strong>3. Desnudos y contenido sexual:</strong> No permitimos desnudos, pornografía ni contenido sexualmente explícito.
          </li>
        </ul>
      </div>
      <div class="text-center">
        <b-button
          class="mt-3"
          variant="outline-success"
          size="lg"
          @click="modalRulesWall = false"
        >
          Entendido
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import moment from 'moment'
function debounce (fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}
export default {
  data () {
    return {
      loading: false,
      Page: 1,
      Backtop: false,
      loadingscroll: false,
      scrolldisabled: false,
      EmptyPost: false,
      EmptyPost2: false,
      Next: '',
      modalRulesWall: false,
      userimg: require('@/assets/sinusuario.png'),
      Memos: [],
      date_end: '',
      date_start: '',
      Postedit: {
        memo_type: '',
        message: '',
        typefeed: '',
        is_private: false,
        is_unknown: false
      },
      Post: {
        memo_type: 'REMINDER',
        message: '',
        typefeed: '',
        is_private: false,
        is_unknown: false
      }
    }
  },
  computed: {
    Poster () {
      return this.Posts
    }
  },
  created () {
    this.ListMemos()
    const date = new Date()
    this.date_start = new Date(date.getFullYear(), 0, 1).getTime()
    this.date_start = new Date(this.date_start).toLocaleDateString('en-CA')
    this.date_end = new Date(date.getFullYear(), 11, 31).getTime()
    this.date_end = new Date(this.date_end).toLocaleDateString('en-CA')
  },
  methods: {
    async PublicMemo () {
      this.loading = true
      if (this.Post.typefeed === 'anonimo') {
        this.Post.is_unknown = true
      }
      if (this.Post.typefeed === 'privado') {
        this.Post.is_private = true
      }
      const post = {
        memo_type: this.Post.memo_type,
        message: this.Post.message,
        is_private: this.Post.is_private,
        is_unknown: this.Post.is_unknown
      }
      await this.$PublicMemo(post)
      await this.ListMemos(true)
      this.Post.message = ''
      this.Post.typefeed = ''
      this.Post.is_private = false
      this.Post.is_unknown = false
      this.loading = false
    },
    async EditMemo (id) {
      this.loading = true
      if (this.Postedit.typefeed === 'anonimo') {
        this.Postedit.is_unknown = true
        this.Postedit.is_private = false
      } else if (this.Postedit.typefeed === 'privado') {
        this.Postedit.is_private = true
        this.Postedit.is_unknown = false
      } else {
        this.Postedit.is_private = false
        this.Postedit.is_unknown = false
      }
      const post = {
        memo_type: this.Postedit.memo_type,
        message: this.Postedit.message,
        is_private: this.Postedit.is_private,
        is_unknown: this.Postedit.is_unknown
      }
      await this.$EditMemo(id, post)
      await this.ListMemos(false)
      this.Postedit.message = ''
      this.Postedit.typefeed = ''
      this.Postedit.is_private = false
      this.Postedit.is_unknown = false
      this.loading = false
    },
    async DeleteMemo (id) {
      this.loading = true
      await this.$DeleteMemo(id)
      await this.ListMemos(false)
      this.loading = false
    },
    async ListMemos (reload) {
      this.loading = true
      let array = ''
      let contpage = 1
      let Memoss = ''
      if (reload) {
        this.Page = 1
      }
      for (let i2 = 0; i2 < this.Page; i2++) {
        Memoss = await this.$ListMemos(this.date_start, this.date_end, contpage)
        this.Next = Memoss.next
        if (array.length < 1) {
          array = Memoss.results
        } else {
          const arrayold = array
          if (Memoss.results.length > 0) {
            array = arrayold.concat(Memoss.results)
          }
        }
        contpage++
      }
      if (this.Next === null) {
        this.loadingscroll = false
      }
      Memoss = array
      for (let i = 0; i < Memoss.length; i++) {
        Memoss[i].edit = false
        if (Memoss[i].user === null) {
          Memoss[i].user = {
            id: 10000
          }
        }
      }
      if (Memoss.length < 1) {
        this.Page = 1
        this.Memos = {}
        this.EmptyPost2 = true
        this.loadingscroll = false
      } else {
        this.EmptyPost2 = false
        this.Memos = Memoss
      }
      console.log(this.Memos)
      this.$refs.dropdown.hide(true)
      this.loading = false
    },
    async GetMemo (index, id) {
      this.loading = true
      for (let i = 0; i < this.Memos.length; i++) {
        this.Memos[i].edit = false
      }
      this.Memos[index].edit = true
      const post = await this.$GetMemo(id)
      if (post.is_private === true) {
        post.typefeed = 'privado'
      }
      if (post.is_unknown === true) {
        post.typefeed = 'anonimo'
      }
      this.Postedit = post
      this.loading = false
    },
    PublicPost2 () {
      const fecha = new Date().toLocaleDateString()
      const hora = new Date().toLocaleTimeString()
      const publish = fecha + ' ' + hora
      const post = {
        name: this.$store.state.localStorage.user.first_name,
        content: this.Post.content,
        time: publish,
        userimg: this.Post.userimg,
        type: this.Post.type
      }
      this.Posts.unshift({ ...post })
      this.Post.content = ''
      this.Post.type = ''
    },
    Enviar () {
      this.deGePost = debounce(this.PublicMemo, 500)
      this.deGePost(1)
    },
    DateFormate (date) {
      const Datenew = moment()
      const DateOld = moment(date)
      const Days = Datenew.diff(DateOld, 'days')
      const hours = Datenew.diff(DateOld, 'hours')
      const minutes = Datenew.diff(DateOld, 'minutes')
      if (Days > 0) {
        return 'Hace ' + Days + ` ${Days === 1 ? 'Dia' : 'Dias'}`
      } else if (hours > 0) {
        return 'Hace ' + hours + ` ${hours === 1 ? 'Hora' : 'Horas'}`
      } else if (minutes > 0) {
        const minutes2 = Datenew.diff(DateOld, 'minutes')
        return 'Hace ' + minutes2 + ` ${minutes2 === 1 ? 'Minuto' : 'Minutos'}`
      } else {
        return 'Hace un instante'
      }
    },
    async loadMore () {
      this.loadingscroll = true
      if (this.Memos.length > 0) {
        this.Backtop = true
        this.scrolldisabled = true
        this.Page = this.Page + 1
        if (this.Next !== null) {
          const Memoss = await this.$ListMemos(this.date_start, this.date_end, this.Page)
          this.Next = Memoss.next
          for (let i = 0; i < Memoss.results.length; i++) {
            Memoss.results[i].edit = false
            this.Memos.push(Memoss.results[i])
            this.scrolldisabled = false
          }
          this.loadingscroll = false
        } else {
          this.Page = this.Page - 1
          this.loadingscroll = false
          this.EmptyPost = true
          if (this.EmptyPost2) {
            this.EmptyPost = false
          }
        }
      } else {
        this.loadingscroll = false
      }
    },
    async backToTop () {
      const element = this.$refs.box
      element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      this.Backtop = false
      await this.ListMemos(true)
      this.scrolldisabled = false
    }
  }
}
</script>
<style lang="scss" scoped>
input:focus,
textarea:focus {
  outline: none !important;
  border-color: transparent !important;
}
.main {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
  margin-top: 0px;
  flex-direction: column;
  flex: 1 1 0%;
  display: flex;
  align-items: flex-start;
  justify-items: start;
}
.row {
  width: 90%;
  margin: 40px auto;
  display: block;
  background-color: white;
  color: #515365;
  margin-bottom: 20px;
  border: 1px solid #e6ecf5;
}
.right_row {
  width: 66%;
  padding: 0px 0px;
}
.publish {
  width: 100%;
  box-shadow: 3px 4px 5px rgba(209, 209, 209, 0.5);
  padding: 0px 15px;
}
.publish_textarea {
  width: 100%;
  display: flex;
  align-items: center;
}
.publish_textarea img {
  width: 40px;
  height: 40px;
  margin: 20px;
}
.border-radius {
  border-radius: 5px;
}
.publish_textarea textarea {
  width: 95.2%;
  height: 40px;
  border: none;
  padding: 7px 20px;
  background: #f8f8f8;
  border-radius: 5px;
  color: #000;
}
.publish_footer {
  border-top: 0.5px solid #d3d3d3;
  width: 100%;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.publish_footer .block2 {
  width: 30%;
  text-align: center;
}
.publish_footer .block4 {
  width: 45%;
  text-align: right;
  display: flex;
  flex-direction: row;
}
.publish_footer .block4 .first {
  width: 60%;
}
.publish_footer .block4 .second {
  width: 20%;
  text-align: left;
  padding-left: 5px;
  padding-top: 2px;
}
.publish_footer .block3 {
  width: 20%;
  text-align: right;
}
.publish_footer .block {
  width: 40%;
  margin-right: 25px;
}
.publish_footer ul {
  width: 75%;
  margin-left: 20px;
}
.publish_footer li {
  height: 50px;
  display: inline-block;
  width: 50px;
  font-size: 19px;
  line-height: 2.5;
  cursor: pointer;
  font-size: 16px;
  line-height: 3;
  text-align: center;
}
.publish_footer ul li:hover {
  background-color: #ff5e3a;
  color: white;
}
.publish_footer button {
  border: none;
  cursor: pointer;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #233348;
  border-radius: 5px;
  font-weight: 500;
}
.publish_footer button:hover {
  background-color: #233348;
}
.feed {
  width: 100%;
  border-radius: 10px;
}
.feed_title {
  padding: 12px 20px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.feed_title .emoji {
  text-align: right;
}
.feed_title img {
  height: 40px;
  width: 40px;
  border-radius: 200px;
  margin: 0px 10px;
}
.feed_title span {
  padding-top: 13px;
  font-size: 16px;
  font-weight: 500;
  margin: 0px 10px;
}
.feed_title span a {
  color: #ff5e3a;
}
.feed_title a b {
  color: #3f4257;
}
.feed_title a b:hover {
  color: #ff5e3a;
}
.feed_title .private {
  font-size: 12px;
  color: #ffb340;
}
.feed_title span p {
  font-size: 14px;
  color: #9e9e9e;
  padding-top: 3px;
  font-weight: 400;
}
.feed_content_image {
  width: 95%;
  margin: 10px auto;
  display: block;
}
.feed_content_image img {
  width: 100%;
}
.feed_content_image iframe {
  width: 100%;
  height: 300px;
}
.feed_content_image p {
  padding: 10px;
  padding-top: 5px;
  color: #9e9e9e;
  font-size: 14px;
}

.suggestions_row {
  width: 25%;
}
.loadmorefeed {
  text-align: center;
  background-color: #ccd1e0;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  color: #ff763a;
  line-height: 3;
}
/*select */
.select-css {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #9e9e9e;
  line-height: 17px;
  padding: 0.6em 1.7em 0.6em 1.7em;
  width: 400420px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 20px auto;
  border: 0px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.03);
  border-radius: 25px;
  background-color: #f8f8f8;
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #888;
}
.select-css:focus {
  border-color: #aaa;
  color: #9e9e9e;
  outline: none;
}
.select-css option {
  font-weight: normal;
  border-radius: 25px;
  background-color: #f8f8f8;
}
.classOfElementToColor:hover {
  background-color: red;
  color: black;
}
.select-css option[selected] {
  background-color: orange;
}
.drop-ico {
  font-size: 18px;
}
.icon-color1 {
  color: #fcbf49;
}
.icon-color2 {
  color: #4cc9f0;
}
.icon-color3 {
  color: #f9c74f;
}
.icon-color4 {
  color: #ffd166;
}
.filters {
  display: flex;
  padding-left: 8px;
}
.filters_content {
  width: 95%;
  margin-bottom: 0px;
}
.filters_content li {
  height: 50px;
  display: inline-block;
  line-height: 2.5;
  font-size: 17px;
  line-height: 3.5;
  text-align: center;
  font-weight: 400;
  margin-right: 14px;
}
.shadow-dropdow {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.text-dropdown {
  font-family: Rubik;
  font-style: normal;
  line-height: 17px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #acacac !important;
  .icon {
    display: flex;
    &::after {
      align-self: center;
      justify-self: end;
      margin-left: 6px;
      content: "";
      width: 0.65em;
      height: 0.35em;
      background-color: #acacac;
      clip-path: polygon(25% 0, 50% 50%, 75% 0%, 100% 0, 50% 100%, 0 0);
    }
    svg {
      height: 18px;
      min-width: 14px;
      margin-right: 5px;
      color: #acacac;
    }
  }
}
.optionpost {
  height: 15px;
  letter-spacing: 1px;
  width: 100%;
  text-align: right;
}
.optionpost button {
  font-size: 15px;
}
.optionpost .icon {
  cursor: pointer;
  margin-right: 7px;
}
input[type="radio"],
input[type="checkbox"] {
  color: #acacac;
  height: 14px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  width: 16px;
}
.loading-scroll {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
}
.post-empty {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
  height: 400px;
}
.spinner-container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
  flex-direction: column;
}
.spinner-container .spinner {
  color: #233348;
  margin-right: 1rem;
}
.spinner-container p {
  margin: 0;
  color: #233348;
  height: fit-content;
}
.spinner-container .empty {
  margin: 0;
  color: #233348;
  height: fit-content;
  font-size: 20px;
}
.goTop {
  border-radius: 5px;
  background-color: #000;
  color: #fff;
  position: fixed;
  width: 45px;
  height: 45px;
  display: block;
  right: 44px;
  bottom: 26px;
  border: none;
  opacity: 0.8;
  z-index: 4;
  transition: all 0.4s ease-in;
}
.goTop .fa {
  color: white;
  font-size: 22px;
}
.goTop:hover {
  opacity: 1;
  background-color: rgb(248, 250, 252);
  background-color: rgba(255, 255, 255, 0.9);
}
.rules-wall {
  width: 33%;
  padding: 0px 0px;
  height: 100vh;
  position: fixed;
  right: 0px;
  top: 160px;
}
.border-radius-tags {
  background-image: linear-gradient(
    to right,
    #b6fcec,
    #c8fcf2,
    #dcfcf4,
    #e4fcf4,
    #f4fcfc,
    #fcfcfc,
    #d4fcf4,
    #ecfcfc
  );
  border-radius: 5px;
  height: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
.rules_feed {
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.rules_feed h2 {
  font-size: 18px;
  padding-top: 15px;
  text-align: center;
}
.rules_feed p {
  font-size: 16px;
  padding-top: 2px;
  padding-left: 2px;
  padding-right: 2px;
  text-align: center;
}
.rules_feed_title {
  padding: 10px 10px 10px 10px;
  width: 100%;
  letter-spacing: 1px;
  align-items: center;
  color: #515365;
}
.rules_feed_title span {
  text-decoration: underline;
  cursor: pointer;
}
.rules_feed_title h4 {
  font-size: 16px;
  padding-left: 17px;
}
.listaruleswall {
  list-style-type: none;
  text-align: left;
}
.listaruleswall li {
  padding-bottom: 20px;
}
.more {
  font-size: 18px;
}
.modal-class > .modal-dialog > .modal-content > .modal-body {
  background-image: url(../../assets/simpleetalks/fondomodal2.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.modal-class2 > .modal-dialog > .modal-content > .modal-body {
  background-image: url(../../assets/simpleetalks/fondomodal2.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.listaruleswall {
  list-style-type: none;
  text-align: left;
}
</style>
