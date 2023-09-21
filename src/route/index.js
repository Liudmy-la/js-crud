// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return Track.#list.find((track) => track.id === id)
  }
}

Track.create(
  `Purple Haze`,
  `Jimi Hendrix`,
  `https://picsum.photos/100/100/?blur=1`,
)

Track.create(
  `Whole Lotta Love`,
  `Led Zeppelin`,
  `https://picsum.photos/100/100/?blur=2`,
)

Track.create(
  `Sympathy for the Devil`,
  `The Rolling Stones`,
  `https://picsum.photos/100/100/?blur=3`,
)

Track.create(
  `Under Pressure`,
  `Queen & David Bowie`,
  `https://picsum.photos/100/100`,
)

Track.create(
  `Baba O'Riley`,
  `The Who`,
  `https://picsum.photos/100/100/?blur=4`,
)

Track.create(
  `Comfortably Numb`,
  `TPink Floyd`,
  `https://picsum.photos/100/100/?blur=5`,
)

Track.create(
  `I Love Rock 'n' Roll`,
  `Joan Jett & the Blackhearts`,
  `https://picsum.photos/100/100/?blur=6`,
)

// console.log(Track.getList())

// ================================================================

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = `https://picsum.photos/100/100`
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => (playlist.id = id),
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrackById(trackId) {
    let newTrack = Track.getById(trackId)
    this.tracks.unshift(newTrack)
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test-2'))
Playlist.makeMix(Playlist.create('Test-3'))

// ================================================================
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',

    data: {},
  })
})

// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

// ================================================================
router.post('/spotify-create', function (req, res) {
  //   console.log(req.body, req.query)
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: `Введіть назву`,
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  //   console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    res.render('alert', {
      style: 'alert',
      data: {
        info: `Такого плейліста не знайдено`,
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================
router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    res.render('alert', {
      style: 'alert',
      data: {
        info: `Такого плейліста не знайдено`,
        link: `//spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

// router.post('/spotify-playlist', function (req, res) {
//   const id = Number(req.query.id)

//   const playlist = Playlist.getById(id)

//   res.render('spotify-create', {
//     style: 'spotify-create',

//     data: {},
//   })
// })

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      tracks: Track.getList(),
      playlistId,
    },
  })
})

// ================================================================

router.get(
  '/spotify-playlist-add-track',
  function (req, res) {
    // console.log(req.query)

    const trackId = Number(req.query.trackId)
    const playlistId = Number(req.query.playlistId)

    const playlist = Playlist.getById(playlistId)

    playlist.addTrackById(trackId)

    res.render('spotify-playlist', {
      style: 'spotify-playlist',

      data: {
        playlistId,
        trackId,
        tracks: playlist.tracks,
        name: playlist.name,
      },
    })
  },
)

// ================================================================

router.get('/', function (req, res) {
  console.log(Playlist.getList())

  res.render('spotify-all-lists', {
    style: 'spotify-all-lists',
    data: {
      lists: Playlist.getList().map(
        ({ tracks, ...rest }) => ({
          ...rest,
          amount: tracks.length,
        }),
      ),
    },
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
    value,
  })
})

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
    value,
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
