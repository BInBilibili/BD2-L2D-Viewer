<template>
  <div
    class="fixed inset-0 z-20 bg-gray-800/70 backdrop-blur-sm text-white flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="relative bg-gray-900 p-4 rounded w-full max-w-lg">
      <button class="absolute top-2 right-3 cursor-pointer" @click="$emit('close')">✕</button>
      <h2 class="text-lg font-bold mb-2">{{ t('upload.spine.title') }}</h2>
      <p class="mb-2">{{ t('upload.spine.descriptionStart') }}<strong>.atlas</strong>{{ t('upload.spine.descriptionSeparator') }}<strong>.skel</strong>{{ t('upload.spine.descriptionOr') }}<strong>.json</strong>{{ t('upload.spine.descriptionAnd') }}<strong>.png</strong>{{ t('upload.spine.descriptionEnd') }}</p>
      <input
        v-model="name"
        type="text"
        :placeholder="t('upload.spine.namePlaceholder')"
        class="bg-gray-700 text-white p-2 w-full mb-2 outline-none"
      />
      <div
        class="border-2 border-dashed rounded p-4 text-center mb-2"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".skel,.json,.atlas,.png"
          class="hidden"
          @change="onFiles"
        />
        <p class="mb-2">
          {{ t('upload.spine.dropHint') }}<span class="text-blue-400 underline cursor-pointer" @click="fileInput?.click()">{{ t('upload.spine.chooseFiles') }}</span>
        </p>
        <div v-if="fileNames.length" class="text-sm break-words">{{ fileNames.join(', ') }}</div>
      </div>
      <div class="min-h-[1.5em] text-sm mb-2" :class="msgClass">{{ message }}</div>
      <div class="text-right">
        <button
          class="bg-gray-600 hover:bg-gray-500 text-white rounded px-4 py-2"
          @click="process"
          :disabled="loading"
        >
          <LoadingIcon v-if="loading" />
          <span v-else>{{ t('upload.spine.submit') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'
import { t } from '@/i18n'

import LoadingIcon from '@/components/icons/LoadingIcon.vue'

const store = useCharacterStore()

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const name = ref('')
const messageKey = ref('')
const messageParams = ref<Record<string, string | number>>({})
const success = ref(false)
const loading = ref(false)

const fileNames = computed(() => files.value.map(f => f.name))
const msgClass = computed(() => (success.value ? 'text-green-400' : 'text-red-400'))
// Translated inside a computed so a language switch re-renders the visible message.
const message = computed(() => (messageKey.value ? t(messageKey.value, messageParams.value) : ''))

function setMessage(key: string, params: Record<string, string | number> = {}) {
  messageKey.value = key
  messageParams.value = params
}

function onFiles(e: Event) {
  files.value = Array.from((e.target as HTMLInputElement).files || [])
}

function onDrop(e: DragEvent) {
  files.value = Array.from(e.dataTransfer?.files || [])
}

function process() {
  setMessage('')
  success.value = false
  if (!name.value.trim()) {
    setMessage('upload.spine.errorNoName')
    return
  }
  const atlas = files.value.find(f => f.name.toLowerCase().endsWith('.atlas'))
  const json = files.value.find(f => f.name.toLowerCase().endsWith('.json'))
  const skel = files.value.find(f => f.name.toLowerCase().endsWith('.skel'))
  const textures = files.value.filter(f => f.name.toLowerCase().endsWith('.png'))
  if (!atlas || (!skel && !json)) {
    setMessage('upload.spine.errorMissingFiles')
    return
  }
  loading.value = true
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const atlasText = String(reader.result)
      const regex = /([^\s]+\.png)/g
      const referenced = Array.from(atlasText.matchAll(regex)).map(m => m[1])
      const missing = referenced.filter(n => !textures.some(tex => tex.name === n))
      if (missing.length > 0) {
        setMessage('upload.spine.errorMissingImages', { names: missing.join(', ') })
        loading.value = false
        return
      }
      const skelUrl = skel ? URL.createObjectURL(skel) : undefined
      const jsonUrl = json ? URL.createObjectURL(json) : undefined
      const atlasUrl = URL.createObjectURL(atlas)
      const base = atlasUrl.slice(0, atlasUrl.lastIndexOf('/') + 1)
      const images = Object.fromEntries(textures.map(tex => [base + tex.name, URL.createObjectURL(tex)]))
      const customFiles = {
        skel: skelUrl,
        json: jsonUrl,
        atlas: atlasUrl,
        images,
      }
      const char = {
        id: `custom-${Date.now()}`,
        charName: name.value.trim(),
        costumeName: 'Custom',
        spine: '',
        cutscene: '',
        dating: '',
        audio: '',
        icon: '',
        customFiles,
      }
      store.characters.unshift(char)
      store.selectedCharacterId = char.id
      success.value = true
      setMessage('upload.spine.success')
      loading.value = false
    } catch (err) {
      setMessage('upload.spine.errorUnexpected', { message: (err as Error).message })
      loading.value = false
    }
  }
  reader.onerror = () => {
    setMessage('upload.spine.errorReadAtlas')
    loading.value = false
  }
  reader.readAsText(atlas)
}
</script>
