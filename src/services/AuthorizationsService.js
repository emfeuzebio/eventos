// src/services/AuthorizationsService.js
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

export function getAbilities() {
   const userStore = useUserStore();
   // return userStore.abilities || [];            // devolve um proxy
   return Array.from(userStore.abilities || []);   // devolve um array
}

export function getRoles() {
   const userStore = useUserStore();
   return userStore.roles || [];
}

export function getProfiles() {
   const userStore = useUserStore();
   return userStore.profiles || [];
}

export function getSystems() {
   const userStore = useUserStore();
   return (userStore.systems || []).filter((system) => system.active == 'Y');
}

export function getSystemId() {
   const userStore = useUserStore();
   return userStore.systemId || null;
}

export function getUserId() {
   const userStore = useUserStore();
   return userStore.userId || null;
}

export function getUserName() {
   const userStore = useUserStore();
   return userStore.name || null;
}

export function getPhoto() {
   const userStore = useUserStore();
   return userStore.photo || null;
}

export function getToken() {
   const userStore = useUserStore();
   return userStore.token || null;
}

export function can(ability) {
   // console.log('can', ability)
   // console.log('can', getAbilities())
   return getAbilities().includes(ability);
}

export function canAny(...abilities) {
   return abilities.some((ability) => getAbilities().includes(ability));
}

export function canAll(...abilities) {
   return abilities.every((ability) => getAbilities().includes(ability));
}

export function useAbilities() {
   const userStore = useUserStore();

   // const abilities = computed(() => userStore.abilities || []);
   // transforma userStore.abilities em array caso venha um objeto
   const abilities = computed(() => {
      const a = userStore.abilities;
      return Array.isArray(a) ? a : [];
    });   

   const can = (ability) => abilities.value.includes(ability);

   const canAny = (...abilityList) => abilityList.some((a) => abilities.value.includes(a));

   const canAll = (...abilityList) => abilityList.every((a) => abilities.value.includes(a));

   return {
      abilities,
      can,
      canAny,
      canAll,
   };
}
