<template>
  <div class="card">
    <h1 class="card__title">Liste des postes</h1>

    <div class="container-fluid gedf-wrapper">
      <div class="row">
        <div class=" gedf-main">
          <div class="card gedf-card" v-for="post in posts" :key="post.id">
            <div class="card-header">{{ post.infos }}</div>
            <div class="card-body">
              <div class="text-muted h7 mb-2">
                <i class="fa fa-clock-o"></i> {{ post.createdAt }}
              </div>
              <a class="card-link" href="#">
                <h5 class="card-title">
                  Ecrit par {{ post.authorName }}
                </h5>
              </a>
              <p class="card-text">
                {{ post.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostsView",
  data: function () {
    return {
      posts: [
        {
          'id': 1,
          'infos': 'Mon premier post',
          'createdAt': '2022-04-12',
          'authorName': 'Jing Zhang',
          'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
        },
        {
          'id': 2,
          'infos': 'Mon deuxieme post',
          'createdAt': '2022-04-10',
          'authorName': 'Mathieu Ferment',
          'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
        }
      ]
    };
  },
};
</script>

<style scoped>
body {
  background-color: #eeeeee;
}

.h7 {
  font-size: 0.8rem;
}

.gedf-wrapper {
  margin-top: 0.97rem;
}

@media (min-width: 992px) {
  .gedf-main {
    padding-left: 4rem;
    padding-right: 4rem;
  }
  .gedf-card {
    margin-bottom: 2.77rem;
  }
}

/**Reset Bootstrap*/
.dropdown-toggle::after {
  content: none;
  display: none;
}
</style>
