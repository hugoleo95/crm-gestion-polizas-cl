<template>
  <div ref="box">
    <div class="main">
      <div class="right_row">
        <div class="row">
          <b-overlay
            :show="loadingpost"
            spinner-variant="primary"
            spinner-type="grow"
            spinner-small
            rounded="sm"
          >
            <div class="publish">
              <div class="publish_textarea">
                <img
                  class="border-radius-image"
                  :src="userimg"
                  alt=""
                >
                <textarea
                  v-model="Post.content"
                  type="text"
                  placeholder="¿Qué quieres compartir con el equipo?"
                  style="resize: none;"
                />
              </div>
              <div class="publish_footer">
                <div class="block">
                  <div class="camp">
                    <input
                      v-model="Post.emoji"
                      type="text"
                      maxlength="1"
                    >
                  </div>
                  <div class="selectemoji">
                    <fa-icon
                      :icon="['far', 'smile']"
                      class="icon"
                      @click="Emojiloading = !Emojiloading"
                    />
                  </div>
                  <picker
                    v-if="Emojiloading"
                    class="emoji"
                    @select="InputEmoji"
                  />
                </div>
                <div class="block2">
                  <textarea
                    v-model="Post.reaction"
                    type="text"
                    placeholder="Me siento"
                    style="resize: none;"
                  />
                </div>
                <div class="block4">
                  <label class="file-select">
                    <div class="select-button">
                      <span>
                        <fa-icon
                          :icon="['far', 'images']"
                          class="icon"
                        />Media
                      </span>
                    </div>
                    <input
                      type="file"
                      @input="handleFileChange"
                    >
                  </label>
                </div>
                <div class="block3">
                  <button @click="Enviar">
                    Publicar
                  </button>
                </div>
              </div>
              <div
                v-if="Post.img"
                class="publish_footer"
              >
                <div class="blockimg">
                  <img
                    :src="Post.img"
                    alt=""
                  >
                </div>
              </div>
              <div
                v-if="Post.video"
                class="publish_footer"
              >
                <video
                  :src="Post.video"
                  controls
                >
                  <source
                    :src="Post.video"
                    type="video/mp4"
                  >
                </video>
              </div>
            </div>
          </b-overlay>
        </div>
        <!--
        <div
          v-if="loadingscroll"
          class="loading-scroll"
        >
          <div class="spinner-container">
            <b-spinner class="spinner" />
            <p>Cargando notificaciones...</p>
          </div>
        </div>
        -->
        <div
          v-if="Optionfilter!=''"
          class="filters"
        >
          <ul class="filters_content">
            <li class="hover-orange selected-orange">
              <span>
                Seleccionado el filtro: <strong> {{ Optionfilter }} </strong>
                <fa-icon
                  :icon="['fas', 'times']"
                  class="icon"
                  @click="Optionfilter = '';ListPoster('', true)"
                />
              </span>
            </li>
          </ul>
        </div>
        <div class="filters">
          <ul class="filters_content">
            <li @click="Optionfilter = 'peliculas';ListPoster('peliculas')">
              <span :class="[ Optionfilter === 'peliculas'? 'selected_filter': 'no_selected_filter',]">
                Peliculas
              </span>
            </li>
            <li @click="Optionfilter = 'vida_sana';ListPoster('vida_sana')">
              <span :class="[ Optionfilter === 'vida_sana'? 'selected_filter': 'no_selected_filter',]">
                Vida Sana
              </span>
            </li>
            <li @click="Optionfilter = 'libros';ListPoster('libros')">
              <span :class="[ Optionfilter === 'libros'? 'selected_filter': 'no_selected_filter',]">
                Libros
              </span>
            </li>
            <li @click="Optionfilter = 'recomendaciones';ListPoster('recomendaciones')">
              <span :class="[ Optionfilter === 'recomendaciones'? 'selected_filter': 'no_selected_filter',]">
                Recomendaciones
              </span>
            </li>
            <li @click="Optionfilter = 'memes';ListPoster('memes')">
              <span :class="[ Optionfilter === 'memes'? 'selected_filter': 'no_selected_filter',]">
                Memes
              </span>
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
              v-for="(post, index) in Posters"
              :key="index"
              class="row border-radius"
            >
              <div
                v-if="post.edit"
                class="publish"
              >
                <div class="publish_textarea">
                  <img
                    class="border-radius-image"
                    :src="userimg"
                    alt=""
                  >
                  <textarea
                    v-model="PostEditContent.content"
                    type="text"
                    placeholder="¿Qué quieres compartir con el equipo?"
                    style="resize: none;"
                  />
                </div>
                <div class="publish_footer">
                  <div class="block">
                    <div class="camp">
                      <input
                        v-model="PostEditContent.react.emoji"
                        type="text"
                        maxlength="1"
                      >
                    </div>
                    <div class="selectemoji">
                      <fa-icon
                        :icon="['far', 'smile']"
                        class="icon"
                        @click="EmojiEdit(index)"
                      />
                    </div>
                    <picker
                      v-if="post.loadingemoji"
                      class="emoji"
                      @select="InputEmojiEdit"
                    />
                  </div>
                  <div class="block2">
                    <textarea
                      v-model="PostEditContent.react.title"
                      type="text"
                      placeholder="Me siento"
                      style="resize: none;"
                    />
                  </div>
                  <div class="block4">
                    <label class="file-select">
                      <div class="select-button">
                        <span>
                          <fa-icon
                            :icon="['far', 'images']"
                            class="icon"
                          />Media
                        </span>
                      </div>
                      <input
                        type="file"
                        @input="handleFileChangeEdit"
                      >
                    </label>
                  </div>
                  <div class="block3">
                    <button @click="EditPost(post.id)">
                      Guardar
                    </button>
                  </div>
                </div>
                <div
                  v-if="PostEditContent.img_post"
                  class="publish_footer"
                >
                  <div class="blockimg">
                    <img
                      :src="PostEditContent.img_post"
                      alt=""
                    >
                  </div>
                </div>
                <div
                  v-if="PostEditContent.video"
                  class="publish_footer"
                >
                  <video
                    :src="PostEditContent.video"
                    controls
                  >
                    <source
                      :src="PostEditContent.video"
                      type="video/mp4"
                    >
                  </video>
                </div>
              </div>
              <div
                v-else
                class="feed"
              >
                <div
                  v-if="post.author.id === $store.state.localStorage.user.id || $store.state.localStorage.user.is_superuser"
                  class="optionpost"
                >
                  <b-dropdown
                    no-caret
                    variant="transparent"
                    text="..."
                    size="lg"
                  >
                    <b-dropdown-item-button @click="GetPost(index, post.id);">
                      <fa-icon
                        :icon="['fas', 'edit']"
                        class="icon"
                      />Editar
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="DeletePost(post.id);">
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
                  <span><b v-if="post.author.first_name">{{ post.author.first_name }}</b><b v-else>{{ post.author.email }}</b><span v-if="post.react">· Se siente {{ post.react.title }} {{ post.react.emoji }} </span><br>
                    <p>{{ DateFormate(post.published) }}</p>
                  </span>
                </div>
                <div class="feed_content">
                  <div class="feed_content_image">
                    <!-- eslint-disable vue/no-v-html -->
                    <p v-html="HastagFormate(post.content)">
                      &nbsp;
                    </p>
                    <!--eslint-enable-->
                    <div v-if="post.img_post">
                      <img
                        :src="post.img_post"
                        alt=""
                      >
                    </div>
                    <div v-if="post.video">
                      <video
                        :src="post.video"
                        controls
                      >
                        <source
                          :src="post.video"
                          type="video/mp4"
                        >
                      </video>
                    </div>
                  </div>
                </div>
                <div class="feed_footer">
                  <ul class="feed_footer_left">
                    <li
                      class="hover-orange selected-orange"
                      @click="ViewLike(index);ConfigLike(post.id, index)"
                    >
                      <span :class="[ post.activelike === true? 'like': 'nolike',]">
                        Me gusta
                      </span>
                    </li>
                    <li @click="ComentView(index)">
                      <span :class="[ post.activecoment === true? 'coment': 'nocoment',]">
                        Comentar
                      </span>
                    </li>
                  </ul>
                  <ul class="feed_footer_right">
                    <li>
                      <ul>
                        <a
                          href="#"
                          style="color:#9E9E9E;"
                        >
                          <li
                            class="hover-orange"
                            @click="ViewLikes(post.likes)"
                          >
                            {{ post.likes.length }} Me gustas
                          </li>
                          <li
                            class="hover-orange"
                            @click="ComentView(index)"
                          >
                            <i class="fa fa-comments-o" />
                            {{ post.comments.length }} comentarios
                            <fa-icon
                              v-if="!post.activecoment"
                              :icon="['fas', 'chevron-down']"
                              class="text-primary drop-ico"
                            />
                            <fa-icon
                              v-if="post.activecoment"
                              :icon="['fas', 'chevron-up']"
                              class="text-primary drop-ico"
                            />
                          </li>
                        </a>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div
                  v-if="post.activecoment"
                  class="feed_coments"
                >
                  <div class="feed_coment_center">
                    <div class="publish_textarea">
                      <img
                        class="border-radius-image"
                        :src="userimg"
                        alt=""
                      >
                      <textarea
                        v-model="coments[index]"
                        type="text"
                        placeholder="Comentario"
                        style="resize: none;"
                      />
                    </div>
                    <div class="send">
                      <button @click="SendComment(post.id, index)">
                        Publicar
                      </button>
                    </div>
                  </div>
                  <div class="feed_coment_list">
                    <div
                      v-for="(coment, indexcomment) in Posters[index].comments"
                      v-show="(post.pag_comment - 1) * post.NUM_RESULTS_COMMENTS <= indexcomment && post.pag_comment * post.NUM_RESULTS_COMMENTS > indexcomment"
                      :key="indexcomment"
                      class="rowcoment border-radius"
                    >
                      <div class="feed_coment">
                        <div class="feed_title_coment">
                          <img
                            :src="userimg"
                            alt=""
                          >
                          <span><b v-if="coment.author.first_name">{{ coment.author.first_name }}</b><b v-else>{{ coment.author.email }}</b>
                            <p>{{ DateFormate(coment.created_on) }}</p>
                          </span>
                        </div>
                        <div class="feed_content">
                          <div class="feed_content_image_comment">
                            <p> {{ coment.comment }} </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <b-button
                        v-show="post.pag_comment != 1"
                        variant="primary"
                        aria-label="Previous"
                        class="py-1 px-1"
                        @click.prevent="post.pag_comment -= 1"
                      >
                        <span aria-hidden="true">
                          <fa-icon
                            :icon="['fas', 'arrow-left']"
                            class="text-white"
                          />
                        </span>
                      </b-button>
                      <b-button
                        v-show="post.pag_comment * post.NUM_RESULTS_COMMENTS / Posters[index].comments.length < 1"
                        variant="primary"
                        aria-label="Next"
                        class="py-1 px-1"
                        @click.prevent="post.pag_comment += 1"
                      >
                        <span aria-hidden="true">
                          <fa-icon
                            :icon="['fas', 'arrow-right']"
                            class="text-white"
                          />
                        </span>
                      </b-button>
                    </div>
                    <div class="text-center">
                      <strong class="text-white">&nbsp;&nbsp;{{ CountPageComment(Posters[index].comments.length, post.NUM_RESULTS_COMMENTS, post.pag_comment) }} / {{ Posters[index].comments.length }} Comentarios&nbsp;&nbsp;</strong>
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
        </b-overlay>
      </div>
      <div class="hastag">
        <b-overlay
          :show="loading"
          spinner-variant="primary"
          spinner-type="grow"
          spinner-small
          rounded="sm"
        >
          <div class="rowtags border-radius-tags">
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
                    @click="modalRulesComunity = true"
                  >Ver más</a>
                </div>
              </div>
            </div>
          </div>
          <div class="rowtags border-radius-tags">
            <div class="hastag_feed">
              <h2>Tendencias</h2>
              <div class="hastag_feed_title">
                <span @click="Optionfilter = '';ListPoster('', true)">
                  <b>
                    #Todos
                  </b>
                </span>
              </div>
              <div
                v-for="(tag, index) in Tags"
                :key="index"
                class="hastag_feed_title"
              >
                <span @click="Optionfilter = tag.title;ListPoster(tag.title, true)">
                  <b>
                    # {{ tag.title }}
                  </b>
                </span>
              </div>
            </div>
          </div>
        </b-overlay>
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
      v-model="modalLikes"
      hide-footer
      hide-header
      title="Normas comunitarias"
      modal-class="modal-class"
    >
      <div class="d-block text-center">
        <h4 class="mt-4 mb-3">
          Likes
        </h4>
        <div class="feed_likes_list">
          <div
            v-for="(li, indelike) in likespost"
            v-show="(pag_likes - 1) * NUM_RESULTS_LIKES <= indelike && pag_likes * NUM_RESULTS_LIKES > indelike"
            :key="indelike"
            class="rowcoment border-radius"
          >
            <div class="feed_likes">
              <div class="feed_title_likes">
                <img
                  :src="userimg"
                  alt=""
                >
                <span><b v-if="li.first_name">{{ li.first_name }}</b><b v-else>{{ li.email }}</b>
                </span>
              </div>
            </div>
          </div>
          <div class="text-center">
            <b-button
              v-show="pag_likes != 1"
              variant="primary"
              aria-label="Previous"
              class="py-1 px-1"
              @click.prevent="pag_likes -= 1"
            >
              <span aria-hidden="true">
                <fa-icon
                  :icon="['fas', 'arrow-left']"
                  class="text-white"
                />
              </span>
            </b-button>
            <b-button
              v-show="pag_likes * NUM_RESULTS_LIKES / likespost.length < 1"
              variant="primary"
              aria-label="Next"
              class="py-1 px-1"
              @click.prevent="pag_likes += 1"
            >
              <span aria-hidden="true">
                <fa-icon
                  :icon="['fas', 'arrow-right']"
                  class="text-white"
                />
              </span>
            </b-button>
          </div>
          <br>
          <div class="text-center">
            <strong class="text-primary">&nbsp;&nbsp;{{ CountPageComment(likespost.length, NUM_RESULTS_LIKES, pag_likes) }} / {{ likespost.length }} Likes&nbsp;&nbsp;</strong>
          </div>
        </div>
      </div>
      <div class="text-center">
        <b-button
          class="mt-3"
          variant="outline-success"
          @click="modalLikes = false"
        >
          Cerrrar
        </b-button>
      </div>
    </b-modal>
    <b-modal
      v-model="modalRulesComunity"
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
        <ul class="my-4 listarulescomunity">
          <li>
            <strong>1. Respeto y empatía:</strong> Formemos una comunidad amable, donde podamos reír, dialogar y compartir en equipo siempre en el márgen del respeto y la empatía.
          </li>
        </ul>
        <h6 class="text-left pl-5">
          <strong>🚫 No está permitido:</strong>
        </h6>
        <ul class="my-4 listarulescomunity">
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
          @click="modalRulesComunity = false"
        >
          Entendido
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script type="module">
import { Picker } from 'emoji-mart-vue'
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
let imgbase64 = ''
let imgbaseedit64 = ''
let videobase64 = ''
let videobaseedit64 = ''
export default {
  components: {
    Picker
  },
  data () {
    return {
      Page: 1,
      loading: false,
      loadingpost: false,
      Backtop: false,
      loadingscroll: false,
      scrolldisabled: false,
      EmptyPost: false,
      Emojiloading: false,
      Optionfilter: '',
      Next: '',
      modalRulesComunity: false,
      modalLikes: false,
      activelike: [],
      activecoment: [],
      userimg: require('@/assets/sinusuario.png'),
      videoupload: require('@/assets/simpleetalks/videofile.png'),
      deGePost: '',
      likespost: [],
      endtags: [],
      coments: [],
      Posters: [],
      Tags: [],
      NUM_RESULTS_LIKES: 0,
      pag_likes: 0,
      PostEditContent: {
        content: '',
        author: this.$store.state.localStorage.user.id,
        status: 'published',
        name: '',
        react: {
          title: '',
          emoji: ''
        },
        time: '',
        userimg: require('@/assets/sinusuario.png'),
        img: '',
        img2: '',
        video: ''
      },
      Post: {
        content: '',
        author: this.$store.state.localStorage.user.id,
        status: 'published',
        name: '',
        reaction: '',
        emoji: '',
        time: '',
        userimg: require('@/assets/sinusuario.png'),
        img: '',
        img2: '',
        video: ''
      }
    }
  },
  computed: {
    Poster () {
      return this.Posts
    }
  },
  created () {
    this.ListPoster('', true)
    this.ListTags()
  },
  methods: {
    async PublicPost () {
      this.loading = true
      const tags = this.Post.content.split(' ').filter(v => v.startsWith('#'))
      if (tags) {
        for (let j = 0; j < tags.length; j++) {
          tags[j] = tags[j].replace('#', '')
          const content = {
            title: tags[j]
          }
          this.endtags.unshift({ ...content })
        }
      }
      const post = {
        content: this.Post.content,
        status: this.Post.status,
        img_post: imgbase64,
        video: videobase64,
        react: {
          title: this.Post.reaction,
          emoji: this.Post.emoji
        },
        tags: this.endtags
      }
      if (!post.react.title || !post.react.emoji) {
        delete post.react
      }
      await this.$PublicPost(post)
      await this.ListPoster(this.Optionfilter, false)
      await this.ListTags()
      this.Post.content = ''
      this.Post.reaction = ''
      this.Post.emoji = ''
      this.Post.img = ''
      this.Post.video = ''
      imgbase64 = ''
      videobase64 = ''
      this.loading = false
    },
    async EditPost (id) {
      this.loading = true
      const tags = this.PostEditContent.content.split(' ').filter(v => v.startsWith('#'))
      if (tags) {
        for (let j = 0; j < tags.length; j++) {
          tags[j] = tags[j].replace('#', '')
          const content = {
            title: tags[j]
          }
          this.endtags.unshift({ ...content })
        }
      }
      const post = {
        content: this.PostEditContent.content,
        status: this.PostEditContent.status,
        img_post: imgbaseedit64,
        video: videobaseedit64,
        react: {
          title: this.PostEditContent.react.title,
          emoji: this.PostEditContent.react.emoji
        },
        tags: this.endtags
      }
      if (!post.react.title || !post.react.emoji) {
        delete post.react
      }
      if (!post.img_post) {
        delete post.img_post
      }
      await this.$UpdatePost(id, post)
      await this.ListPoster(this.Optionfilter, false)
      await this.ListTags()
      this.PostEditContent.content = ''
      this.PostEditContent.react.title = ''
      this.PostEditContent.react.emoji = ''
      this.PostEditContent.img = ''
      this.PostEditContent.video = ''
      imgbaseedit64 = ''
      videobaseedit64 = ''
      this.loading = false
    },
    async GetPost (index, id) {
      this.loading = true
      for (let i = 0; i < this.Posters.length; i++) {
        this.Posters[i].edit = false
      }
      this.Posters[index].edit = true
      const post = await this.$GetPost(id)
      this.PostEditContent = post
      if (this.PostEditContent.react === null) {
        this.PostEditContent.react = {
          title: '',
          emoji: ''
        }
      }
      if (this.PostEditContent.img_post === null) {
        this.PostEditContent.img_post = ''
      }
      this.loading = false
    },
    async ListPoster (value, reload) {
      this.Optionfilter = value
      this.scrolldisabled = false
      this.EmptyPost = false
      this.loading = true
      let array = ''
      let Posteer = ''
      let contpage = 1
      if (reload) {
        this.Page = 1
      }
      for (let i2 = 0; i2 < this.Page; i2++) {
        Posteer = await this.$ListPoster(value, contpage)
        this.Next = Posteer.next
        if (array.length < 1) {
          array = Posteer.results
        } else {
          const arrayold = array
          if (Posteer.results.length > 0) {
            array = arrayold.concat(Posteer.results)
          }
        }
        contpage++
      }
      // console.log(this.Posters)
      const Posters = array
      for (let i = 0; i < Posters.length; i++) {
        Posters[i].activecoment = false
        Posters[i].edit = false
        Posters[i].loadingemoji = false
        Posters[i].NUM_RESULTS_COMMENTS = 5
        Posters[i].pag_comment = 1
        const Likes = Posters[i].likes
        for (let ilikes = 0; ilikes < Likes.length; ilikes++) {
          const activelike = Likes[ilikes].id
          if (activelike === this.Post.author) {
            Posters[i].activelike = true
          } else {
            Posters[i].activelike = false
          }
        }
      }
      this.Posters = Posters
      this.loading = false
    },
    async DeletePost (id) {
      this.loading = true
      await this.$DeletePost(id)
      await this.ListPoster(this.Optionfilter, false)
      this.loading = false
    },
    async ListTags () {
      this.loading = true
      this.Tags = await this.$ListTags()
      this.loading = false
    },
    PublicPost2 () {
      this.loading = true
      const fecha = new Date().toLocaleDateString()
      const hora = new Date().toLocaleTimeString()
      const publish = fecha + ' ' + hora
      const post = {
        name: this.$store.state.localStorage.user.first_name,
        content: this.Post.content,
        reaction: this.Post.reaction,
        emoji: this.Post.emoji,
        time: publish,
        userimg: this.Post.userimg,
        coments: [],
        img: this.Post.img,
        like: false,
        activecoment: false
      }
      this.Posts.unshift({ ...post })
      this.Post.content = ''
      this.Post.reaction = ''
      this.Post.img = ''
      this.loading = false
    },
    Enviar () {
      this.deGePost = debounce(this.PublicPost, 500)
      this.deGePost(1)
    },
    async SendComment (id, index) {
      this.loading = true
      const comentnew = {
        comment: this.coments[index],
        post: id
      }
      const resp = await this.$PublicComent(comentnew)
      this.coments[index] = ''
      this.Posters[index].comments.unshift({ ...resp })
      this.loading = false
    },
    async ConfigLike (id, index) {
      this.loading = true
      const like = {
        id
      }
      await this.$ConfigLike(like)
      if (this.Posters[index].activelike) {
        this.Posters[index].likes.unshift({ ...like })
      } else {
        this.Posters[index].likes = this.Posters[index].likes.filter(item => item.id !== id)
      }
      this.loading = false
    },
    handleFileChange (e) {
      this.loadingpost = true
      const file = e.target.files[0]
      const type = file.type.substring(0, 5)
      if (type === 'video') {
        imgbase64 = ''
        this.Post.video = URL.createObjectURL(file)
        const reader = new FileReader()
        reader.onload = function () {
          const base64String = reader.result.replace('data:', '')
            .replace(/^.+,/, '')
          videobase64 = base64String
        }
        reader.readAsDataURL(file)
      } else if (type === 'image') {
        videobase64 = ''
        this.Post.img = URL.createObjectURL(file)
        const reader = new FileReader()
        reader.onload = function () {
          const base64String = reader.result.replace('data:', '')
            .replace(/^.+,/, '')
          imgbase64 = base64String
        }
        reader.readAsDataURL(file)
      } else {
        this.$store.commit('setAlertMessage', { error: 'Formato de archivo no permitido' })
      }
      this.loadingpost = false
    },
    handleFileChangeEdit (e) {
      const file = e.target.files[0]
      const type = file.type.substring(0, 5)
      if (type === 'video') {
        imgbaseedit64 = ''
        this.PostEditContent.video = URL.createObjectURL(file)
        const reader = new FileReader()
        reader.onload = function () {
          const base64String = reader.result.replace('data:', '')
            .replace(/^.+,/, '')
          videobaseedit64 = base64String
        }
        reader.readAsDataURL(file)
      } else if (type === 'image') {
        videobaseedit64 = ''
        this.PostEditContent.img_post = URL.createObjectURL(file)
        const reader = new FileReader()
        reader.onload = function () {
          const base64String = reader.result.replace('data:', '')
            .replace(/^.+,/, '')
          imgbaseedit64 = base64String
        }
        reader.readAsDataURL(file)
      } else {
        this.$store.commit('setAlertMessage', { error: 'Formato de archivo no permitido' })
      }
    },
    InputEmojiEdit (emoji) {
      this.PostEditContent.react.emoji = ''
      this.PostEditContent.react.emoji = this.PostEditContent.react.emoji + emoji.native
    },
    InputEmoji (emoji) {
      this.Post.emoji = ''
      this.Post.emoji = this.Post.emoji + emoji.native
      this.Emojiloading = false
    },
    EmojiEdit (index) {
      if (this.Posters[index].loadingemoji) {
        this.Posters[index].loadingemoji = false
      } else {
        this.Posters[index].loadingemoji = true
      }
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
    CountPageComment (cantcomment, numresultcomment, pagcomment) {
      if (cantcomment > numresultcomment * pagcomment) {
        return pagcomment * numresultcomment
      }
      return cantcomment
    },
    HastagFormate (text) {
      const repl = text.replace(/#(\w+)/g, '<a href="#">#$1</a>')
      return repl
    },
    ComentView (index) {
      if (this.Posters[index].activecoment) {
        this.Posters[index].activecoment = false
      } else {
        this.Posters[index].activecoment = true
      }
    },
    ViewLike (index) {
      if (this.Posters[index].activelike) {
        this.Posters[index].activelike = false
      } else {
        this.Posters[index].activelike = true
      }
    },
    ViewLikes (data) {
      this.NUM_RESULTS_LIKES = 5
      this.pag_likes = 1
      this.likespost = data
      this.modalLikes = true
    },
    async loadMore () {
      this.loadingscroll = true
      if (this.Posters.length > 0) {
        this.Backtop = true
        this.scrolldisabled = true
        this.Page = this.Page + 1
        if (this.Next !== null) {
          const Posteer = await this.$ListPoster(this.Optionfilter, this.Page)
          this.Next = Posteer.next
          for (let i = 0; i < Posteer.results.length; i++) {
            Posteer.results[i].activecoment = false
            Posteer.results[i].edit = false
            Posteer.results[i].loadingemoji = false
            const Likes = Posteer.results[i].likes
            for (let ilikes = 0; ilikes < Likes.length; ilikes++) {
              const activelike = Likes[ilikes].id
              if (activelike === this.Post.author) {
                Posteer.results[i].activelike = true
              } else {
                Posteer.results[i].activelike = false
              }
            }
            this.Posters.push(Posteer.results[i])
            this.scrolldisabled = false
          }
          // this.Posters.push(Posteer)
          this.loadingscroll = false
        } else {
          this.Page = this.Page - 1
          this.loadingscroll = false
          this.EmptyPost = true
        }
      } else {
        this.loadingscroll = false
      }
    },
    async backToTop () {
      const element = this.$refs.box
      element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      this.Backtop = false
      await this.ListPoster('', true)
      this.scrolldisabled = false
    }
  }
}
</script>

<style scoped>
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
  flex-direction: row;
  flex: 1 1 0%;
  display: flex;
  align-items: flex-start;
  justify-items: start;
  display: flex;
}
.row {
  width: 90%;
  margin: 40px auto;
  display: block;
  background-color: white;
  color: #515365;
  margin-bottom: 20px;
  border: 1px solid #e6ecf5;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.rowtags {
  width: 100%;
  margin: 40px auto;
  display: block;
  background-color: white;
  color: #515365;
  margin-bottom: 20px;
  border: 1px solid #e6ecf5;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.rowcoment {
  width: 90%;
  margin: 10px auto;
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
.hastag {
  width: 33%;
  padding: 0px 0px;
  height: 100vh;
  /*
  position: relative;
  right: 0px;
  top: 160px;
  */
}
.publish {
  width: 100%;
  box-shadow: 3px 4px 5px rgba(209, 209, 209, 0.5);
  padding: 0px 10px;
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
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
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
.publish_footer textarea {
  width: 95.2%;
  height: 40px;
  border: none;
  padding: 7px 20px;
  background: #f8f8f8;
  border-radius: 5px;
  color: #000;
}
.publish_footer input {
  width: 95.2%;
  height: 40px;
  border: none;
  padding: 7px 20px;
  background: #f8f8f8;
  border-radius: 5px;
  color: #000;
  font-size: 23px;
}
.publish_footer .emoji {
  position: absolute;
  z-index: 1;
  margin-top: 41px;
}
.publish_footer {
  width: 100%;
  border-top: 0.5px solid #d3d3d3;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  padding-top: 25px;
  padding-left: 15px;
  padding-right: 15px;
}
.publish_footer .block2 {
  width: 45%;
  padding-top: 7px;
  text-align: center;
}
.publish_footer .block3 {
  width: 16%;
  text-align: right;
}
.publish_footer .block4 {
  width: 18%;
  text-align: center;
  padding-top: 7px;
}
.publish_footer .blockimg {
  width: 100%;
  text-align: center;
  padding-top: 7px;
  text-align: left;
}
.publish_footer .blockimg img {
  width: 200px;
  height: auto;
  text-align: left;
}
.publish_footer .block {
  width: 18%;
  margin-right: 2px;
  display: flex;
}
.publish_footer .block .icon {
  font-size: 23px;
  cursor: pointer;
}
.publish_footer .block .camp {
  width: 65%;
}
.publish_footer .block .selectemoji {
  width: 35%;
  padding-top: 7px;
}
.publish_footer .block span {
  font-size: 15px;
  font-weight: 400;
  color: #9e9e9e;
  line-height: 17px;
  padding: 0.6em 1.4em 0.6em 1.2em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 20px auto;
  border: 0px solid #aaa;
  box-shadow: 0 1px 0 1px rgb(0 0 0 / 3%);
  border-radius: 25px;
  background-color: #f8f8f8;
}
.publish_footer .block span .icon {
  color: #9dd345;
  margin-right: 8px;
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
.feed_coment {
  width: 100%;
  border-radius: 10px;
  height: auto;
}
.feed_coment_list {
  background: #233348;
  border-radius: 5px;
  width: 100%;
  padding-bottom: 8px;
}
.feed_title_coment {
  padding: 0px 20px 1px 20px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.feed_likes {
  width: 100%;
  border-radius: 10px;
  height: auto;
}
.feed_likes_list {
  margin-top: 30px;
  border-radius: 5px;
  width: 100%;
  padding-bottom: 8px;
}
.feed_title_likes {
  padding: 10px 35px 0px 20px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
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
.feed_title_coment img {
  height: 30px;
  width: 30px;
  border-radius: 200px;
  margin: 0px 10px;
}
.feed_title_coment span {
  padding-top: 10px;
  font-size: 14px;
  font-weight: 500;
  margin: 0px 10px;
}
.feed_title_coment span a {
  color: #ff5e3a;
}
.feed_title_coment a b {
  color: #3f4257;
}
.feed_title_coment a b:hover {
  color: #ff5e3a;
}
.feed_title_coment span p {
  font-size: 14px;
  color: #9e9e9e;
  padding-top: 3px;
  font-weight: 400;
  margin-bottom: 0px;
}

.feed_title_likes img {
  height: 30px;
  width: 30px;
  border-radius: 200px;
  margin: 0px 10px;
}
.feed_title_likes span {
  padding-top: 4px;
  font-size: 14px;
  font-weight: 500;
  margin: 0px 5px;
}
.feed_title_likes span a {
  color: #ff5e3a;
}
.feed_title_likes a b {
  color: #3f4257;
}
.feed_title_likes a b:hover {
  color: #ff5e3a;
}
.feed_title_likes span p {
  font-size: 14px;
  color: #9e9e9e;
  padding-top: 3px;
  font-weight: 400;
  margin-bottom: 0px;
}
.feed {
  width: 100%;
  border-radius: 10px;
}
.feed_title {
  padding: 12px 20px 1px 20px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.hastag_feed {
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.hastag_feed h2 {
  font-size: 18px;
  padding: 20px;
  text-align: center;
}
.hastag_feed_title {
  padding: 10px 10px 10px 10px;
  width: 100%;
  letter-spacing: 1px;
  align-items: center;
  color: #515365;
}
.hastag_feed_title:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(0, 226, 170, var(--tw-bg-opacity));
  color: #fff !important;
}
.hastag_feed_title span {
  text-decoration: underline;
  cursor: pointer;
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
.feed_title span p {
  font-size: 14px;
  color: #9e9e9e;
  padding-top: 3px;
  font-weight: 400;
}
.feed_content_image {
  width: 100%;
  display: block;
  padding-bottom: 35px;
}
.feed_content_image_comment {
  width: 100%;
  display: block;
}
.feed_content_image_comment p {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 10px;
  color: #9e9e9e;
  font-size: 14px;
}
.feed_content_image img {
  width: 100%;
}
.feed_content_image video {
  width: 100%;
  object-fit: fill;
}
.feed_content_image iframe {
  width: 100%;
  height: 300px;
}
.feed_content_image p {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 10px;
  color: #9e9e9e;
  font-size: 14px;
}
.feed_coments {
  display: flex;
  justify-items: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
}
.feed_coment_center {
  width: 100%;
  padding-left: 35px;
  padding-right: 35px;
  padding-bottom: 20px;
}
.feed_coment_center .send {
  text-align: right;
}
.feed_coment_center .send button {
  border: none;
  cursor: pointer;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #233348;
  border-radius: 5px;
  font-weight: 500;
}
.feed_footer {
  display: flex;
}
.feed_footer_left {
  width: 55%;
  margin-bottom: 30px;
}
.feed_footer_left li {
  height: 50px;
  display: inline-block;
  line-height: 2.5;
  cursor: pointer;
  font-size: 14px;
  line-height: 3.5;
  text-align: center;
  margin-right: 35px;
}
.feed_footer_left li span {
  font-size: 14px;
  border-radius: 25px;
  padding: 10px 15px 10px 15px;
}
.like {
  background: #233348;
  color: #fff;
}
.nolike {
  background: #f8f8f8;
  color: #9e9e9e;
}
.coment {
  background: #233348;
  color: #fff;
}
.nocoment {
  background: #f8f8f8;
  color: #9e9e9e;
}
.feed_footer_left li i {
  font-size: 16px;
}
.feed_footer_right {
  width: 50%;
  text-align: right;
}
.feed_footer_right li {
  display: inline-block;
  line-height: 0;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  margin-right: 10px;
  line-height: 3.5;
}
.feed_footer_right li i {
  font-size: 16px;
  padding-right: 5px;
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
.publish_emoji {
  width: 100% !important;
  height: 40px !important;
  border: none !important;
  padding: 3px 4px !important;
  background: #f8f8f8 !important;
  border-radius: 5px !important;
  color: #e1e1e1 !important;
}
.publish_emoji textarea {
  resize: none;
}
.filters {
  display: flex;
}
.filters_content {
  width: 95%;
  margin-bottom: 10px;
}
.filters_content li {
  height: 50px;
  display: inline-block;
  line-height: 2.5;
  font-size: 14px;
  line-height: 3.5;
  text-align: center;
  margin-right: 14px;
}
.dropdown-option {
  font-size: 25px;
}
.filters_content li .icon {
  cursor: pointer;
  margin-left: 7px;
}
.filters_content li span {
  font-size: 18px;
  border-radius: 25px;
  padding: 10px 15px 10px 15px;
}
.filters_content li {
  height: 50px;
  display: inline-block;
  line-height: 2.5;
  cursor: pointer;
  font-size: 14px;
  line-height: 3.5;
  text-align: center;
  margin-right: 14px;
}
.selected_filter {
  background: #233348;
  color: #fff;
}
.no_selected_filter {
  background: #f8f8f8;
  color: #9e9e9e;
}
/*select */
.select-css {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #9e9e9e;
  line-height: 17px;
  padding: 0.6em 1.4em 0.6em 1.2em;
  width: 400px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 20px auto;
  border: 0px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.03);
  border-radius: 25px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
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
  box-shadow: 0 0 1px 3px rgb(0 226 170);
  box-shadow: 0 0 0 3px -moz-mac-focusring;
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
.file-select {
  font-size: 15px;
  border-radius: 25px;
  background: #f8f8f8;
  color: #9e9e9e;
  padding: 0px 25px 8px 19px;
  cursor: pointer;
}
.file-select > .select-button {
  padding-top: 8px;
  padding-bottom: 2px;
  border-radius: 0.3rem;
  text-align: center;
  font-weight: bold;
}
.file-select .icon {
  margin-right: 6px;
  color: #233348;
}
.file-select > input[type="file"] {
  display: none;
}
.loading-scroll {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
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
  background-color: rgb(1, 14, 27);
  background-color: rgb(0 226 170);
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
.listarulescomunity {
  list-style-type: none;
  text-align: left;
}
.listarulescomunity li {
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
