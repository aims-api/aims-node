import { API_HOST } from '../consts'
import axios, { AxiosInstance } from 'axios'
import { download } from '../endpoints/download'
import { getTrack } from '../endpoints/track/get'
import { updateTrack } from '../endpoints/track/update'
import { addNewTrack } from '../endpoints/track/create'
import { deleteTrack } from '../endpoints/track/delete'
import { listTracks } from '../endpoints/track/list'
import { countTracks } from '../endpoints/track/count'
import { listTags } from '../endpoints/tag/list'
import { countTags } from '../endpoints/tag/count'
import { singleSeed } from '../endpoints/playlist/create/singleSeed'
import { byId } from '../endpoints/query/byId'
import { byIds } from '../endpoints/query/byIds'
import { byUrl } from '../endpoints/query/byUrl'
import { byFileUrl } from '../endpoints/query/byFileUrl'
import { byAudioFile } from '../endpoints/query/byAudioFile'
import { byAudioFileHash } from '../endpoints/query/byAudioFileHash'
import { byText } from '../endpoints/query/byText'
import { byTextHash } from '../endpoints/query/byTextHash'
import { byTag } from '../endpoints/query/byTag'
import { multipleSeeds } from '../endpoints/playlist/create/multipleSeeds'
import { transition } from '../endpoints/playlist/create/transition'
import { byTitle as getArtistsByTitle } from '../endpoints/artist/get/byTitle'
import { createCollection } from '../endpoints/collections/create'
import { listCollection } from '../endpoints/collections/list'
import { countCollections } from '../endpoints/collections/count'
import { getCollection } from '../endpoints/collections/get'
import { updateCollection } from '../endpoints/collections/update'
import { deleteCollection } from '../endpoints/collections/delete'
import { addTrackToCollectionById } from '../endpoints/collections/addTrack/byId'
import { addTrackToCollectionByUrl } from '../endpoints/collections/addTrack/byUrl'
import { addTrackToCollectionByFileUrl } from '../endpoints/collections/addTrack/byFileUrl'
import { addTrackToCollectionByFile } from '../endpoints/collections/addTrack/byFile'
import { getTracks } from '../endpoints/collections/getTracks'
import { deleteTrackFromCollection } from '../endpoints/collections/deleteTrack'
import { suggestTracks } from '../endpoints/collections/suggest'
import { byKey as searchSimilarByKey } from '../endpoints/collections/searchSimilar/byKey'
import { byId as searchSimilarById } from '../endpoints/collections/searchSimilar/byId'
import { plugById } from '../endpoints/collections/plug/byId'
import { plugByUrl } from '../endpoints/collections/plug/byUrl'
import { plugByFileUrl } from '../endpoints/collections/plug/byFileUrl'
import { plugByFile } from '../endpoints/collections/plug/byFile'
import { getWaveform } from '../endpoints/track/waveform'
import { searchTracks } from '../endpoints/track/search'
import { getValues } from '../endpoints/track/values'
import { createSnapshot } from '../endpoints/collections/snapshot/create'
import { getSnapshot } from '../endpoints/collections/snapshot/get'
import { search } from '../endpoints/search'
import { autocomplete } from '../endpoints/autocomplete'
import { promptSuggestions } from '../endpoints/autocomplete/promptSuggestions'
import { cloneSnapshot } from '../endpoints/collections/snapshot/clone'
import { createPlaylistFromProject } from '../endpoints/collections/playlist/create'

interface CredentialsOptions {
  authorization: string | null
  cookie?: string
  apiHost?: string
  userId?: string
}

interface InternalConfiguration {
  credentials: CredentialsOptions
}

class Client {
  private client: AxiosInstance | null = null

  private readonly internal: InternalConfiguration = {
    credentials: {
      authorization: null,
      apiHost: API_HOST,
    },
  }

  private readonly refreshClient = (configOverride = {}) => {
    const { authorization, cookie, apiHost, userId } = this.internal.credentials
    const config = {
      baseURL: apiHost,
      headers: {
        Authorization: authorization,
        Cookie: cookie,
        'User-Agent': `aims-node/${require('../../package.json').version}`,
        'X-User-Id': userId,
      },
      ...configOverride,
    }
    this.client = axios.create(config)
    return this.client
  }

  private readonly getClient = (configOverride = {}) => {
    if (this.client === null) {
      return this.refreshClient(configOverride)
    }
    return this.client
  }

  readonly endpoints = {
    album: {
      get: {
        byKey: getCollection(this.getClient, 'albums', 'by-key'),
        byId: getCollection(this.getClient, 'albums', 'by-id'),
      },
      searchSimilar: {
        byKey: searchSimilarByKey(this.getClient, 'albums'),
        byId: searchSimilarById(this.getClient, 'albums'),
      },
      getTracks: {
        byKey: getTracks(this.getClient, 'albums', 'by-key'),
        byId: getTracks(this.getClient, 'albums', 'by-id'),
      },
    },
    artist: {
      get: {
        byKey: getCollection(this.getClient, 'artists', 'by-key'),
        byId: getCollection(this.getClient, 'artists', 'by-id'),
        byTitle: getArtistsByTitle(this.getClient),
      },
      searchSimilar: {
        byKey: searchSimilarByKey(this.getClient, 'artists'),
        byId: searchSimilarById(this.getClient, 'artists'),
      },
      getTracks: {
        byKey: getTracks(this.getClient, 'artists', 'by-key'),
        byId: getTracks(this.getClient, 'artists', 'by-id'),
      },
    },
    customTag: {
      create: createCollection(this.getClient, 'custom-tag'),
      list: listCollection(this.getClient, 'custom-tag'),
      count: countCollections(this.getClient, 'custom-tag'),
      get: {
        byKey: getCollection(this.getClient, 'custom-tag', 'by-key'),
        byId: getCollection(this.getClient, 'custom-tag', 'by-id'),
      },
      update: {
        byKey: updateCollection(this.getClient, 'custom-tag', 'by-key'),
        byId: updateCollection(this.getClient, 'custom-tag', 'by-id'),
      },
      delete: {
        byKey: deleteCollection(this.getClient, 'custom-tag', 'by-key'),
        byId: deleteCollection(this.getClient, 'custom-tag', 'by-id'),
      },
      addTrack: {
        byId: addTrackToCollectionById(this.getClient, 'custom-tag'),
        byUrl: addTrackToCollectionByUrl(this.getClient, 'custom-tag'),
        byFileUrl: addTrackToCollectionByFileUrl(this.getClient, 'custom-tag'),
        byFile: addTrackToCollectionByFile(this.getClient, 'custom-tag'),
      },
      getTracks: {
        byKey: getTracks(this.getClient, 'custom-tag', 'by-key'),
        byId: getTracks(this.getClient, 'custom-tag', 'by-id'),
      },
      removeTrack: deleteTrackFromCollection(this.getClient, 'custom-tag'),
      suggest: {
        byKey: suggestTracks(this.getClient, 'custom-tag', 'by-key'),
        byId: suggestTracks(this.getClient, 'custom-tag', 'by-id'),
      },
    },
    project: {
      create: createCollection(this.getClient, 'project'),
      list: listCollection(this.getClient, 'project'),
      count: countCollections(this.getClient, 'project'),
      get: {
        byKey: getCollection(this.getClient, 'project', 'by-key'),
        byId: getCollection(this.getClient, 'project', 'by-id'),
      },
      update: {
        byKey: updateCollection(this.getClient, 'project', 'by-key'),
        byId: updateCollection(this.getClient, 'project', 'by-id'),
      },
      delete: {
        byKey: deleteCollection(this.getClient, 'project', 'by-key'),
        byId: deleteCollection(this.getClient, 'project', 'by-id'),
      },
      addTrack: {
        byId: addTrackToCollectionById(this.getClient, 'project'),
        byUrl: addTrackToCollectionByUrl(this.getClient, 'project'),
        byFileUrl: addTrackToCollectionByFileUrl(this.getClient, 'project'),
        byFile: addTrackToCollectionByFile(this.getClient, 'project'),
      },
      getTracks: {
        byKey: getTracks(this.getClient, 'project', 'by-key'),
        byId: getTracks(this.getClient, 'project', 'by-id'),
      },
      removeTrack: deleteTrackFromCollection(this.getClient, 'project'),
      suggest: {
        byKey: suggestTracks(this.getClient, 'project', 'by-key'),
        byId: suggestTracks(this.getClient, 'project', 'by-id'),
      },
      snapshot: {
        create: createSnapshot(this.getClient),
        get: getSnapshot(this.getClient),
        clone: cloneSnapshot(this.getClient),
      },
      playlist: {
        create: {
          byKey: createPlaylistFromProject(this.getClient, 'by-key'),
          byId: createPlaylistFromProject(this.getClient, 'by-id'),
        },
      },
    },
    playlist: {
      build: {
        singleSeed: singleSeed(this.getClient),
        multipleSeeds: multipleSeeds(this.getClient),
        transition: transition(this.getClient),
      },
      create: createCollection(this.getClient, 'playlist'),
      list: listCollection(this.getClient, 'playlist'),
      count: countCollections(this.getClient, 'playlist'),
      get: {
        byKey: getCollection(this.getClient, 'playlist', 'by-key'),
        byId: getCollection(this.getClient, 'playlist', 'by-id'),
      },
      update: {
        byKey: updateCollection(this.getClient, 'playlist', 'by-key'),
        byId: updateCollection(this.getClient, 'playlist', 'by-id'),
      },
      delete: {
        byKey: deleteCollection(this.getClient, 'playlist', 'by-key'),
        byId: deleteCollection(this.getClient, 'playlist', 'by-id'),
      },
      addTrack: {
        byId: addTrackToCollectionById(this.getClient, 'playlist'),
        byUrl: addTrackToCollectionByUrl(this.getClient, 'playlist'),
        byFileUrl: addTrackToCollectionByFileUrl(this.getClient, 'playlist'),
        byFile: addTrackToCollectionByFile(this.getClient, 'playlist'),
      },
      getTracks: {
        byKey: getTracks(this.getClient, 'playlist', 'by-key'),
        byId: getTracks(this.getClient, 'playlist', 'by-id'),
      },
      removeTrack: deleteTrackFromCollection(this.getClient, 'playlist'),
      suggest: {
        byKey: suggestTracks(this.getClient, 'playlist', 'by-key'),
        byId: suggestTracks(this.getClient, 'playlist', 'by-id'),
      },
      searchSimilar: {
        byKey: searchSimilarByKey(this.getClient, 'playlist'),
        byId: searchSimilarById(this.getClient, 'playlist'),
      },
      plug: {
        byId: plugById(this.getClient, 'playlist'),
        byUrl: plugByUrl(this.getClient, 'playlist'),
        byFileUrl: plugByFileUrl(this.getClient, 'playlist'),
        byFile: plugByFile(this.getClient, 'playlist'),
      },
    },
    query: {
      byId: byId(this.getClient),
      byIds: byIds(this.getClient),
      byUrl: byUrl(this.getClient),
      byFileUrl: byFileUrl(this.getClient),
      byAudioFile: byAudioFile(this.getClient),
      byAudioFileHash: byAudioFileHash(this.getClient),
      byText: byText(this.getClient),
      byTextHash: byTextHash(this.getClient),
      byTag: byTag(this.getClient),
    },
    download: download(this.getClient),
    track: {
      get: getTrack(this.getClient),
      update: updateTrack(this.getClient),
      create: addNewTrack(this.getClient),
      delete: deleteTrack(this.getClient),
      list: listTracks(this.getClient),
      count: countTracks(this.getClient),
      waveform: getWaveform(this.getClient),
      search: searchTracks(this.getClient),
      values: getValues(this.getClient),
    },
    tag: {
      list: listTags(this.getClient),
      count: countTags(this.getClient),
    },
    autocomplete: autocomplete(this.getClient),
    promptSuggestions: promptSuggestions(this.getClient),
    search: search(this.getClient),
  }

  constructor(options?: CredentialsOptions) {
    this.internal = {
      credentials: {
        authorization: options?.authorization ?? null,
        cookie: options?.cookie,
        apiHost: options?.apiHost ?? API_HOST,
        userId: options?.userId,
      },
    }
  }
}

export { Client, InternalConfiguration }
