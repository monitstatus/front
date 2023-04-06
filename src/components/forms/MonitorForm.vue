<template>
  <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate pb-8">
    {{ editing ? 'Edit' : 'Create' }} Monitor
  </h2>

  <form @submit.prevent="onSubmit">
    <Disclosure :defaultOpen="true" v-slot="{ open }">
      <DisclosureButton>
        <h1 class="flex items-center cursor-pointer">
          <div class="hidden sm:block border-4 border-blue-400 rounded-full w-10 h-10 text-lg text-center leading-8 text-blue-400">1</div>
          <div class="pl-2">
            <ChevronRightIcon
              :class="open ? 'rotate-90 transform' : ''"
              class="h-5 w-5 text-gray-400"
            />
          </div>
          <div class="pl-2 font-light text-xl">Choose request type</div>
        </h1>
      </DisclosureButton>
      <DisclosurePanel class="ml-5 sm:pl-16 my-1 pt-2 pb-5 sm:border-l-4 sm:border-blue-400">
        <div class="inline-flex rounded-md shadow-sm text-xs font-medium">
          <button
            type="button"
            @click="form.monitorType = 'http'"
            :class="form.monitorType === 'http' ? 'bg-blue-500 text-gray-200 hover:bg-blue-600 hover:text-gray-100' : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700'"
            class="py-2 px-3 rounded-l-lg border border-gray-200 focus:z-10">
            HTTP
          </button>
          <button
            type="button"
            @click="form.monitorType = 'ping'"
            :class="form.monitorType == 'ping' ? 'bg-blue-500 text-gray-200 hover:bg-blue-600 hover:text-gray-100' : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700'"
            class="py-2 px-3 border-t border-b border-gray-200 focus:z-10">
            Ping
          </button>
          <button
            type="button"
            @click="form.monitorType = 'tcp'"
            :class="form.monitorType == 'tcp' ? 'bg-blue-500 text-gray-200 hover:bg-blue-600 hover:text-gray-100' : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700'"
            class="py-2 px-3 border-t border-b border-gray-200 focus:z-10">
            TCP
          </button>
          <button
            type="button"
            @click="form.monitorType = 'udp'"
            :class="form.monitorType == 'udp' ? 'bg-blue-500 text-gray-200 hover:bg-blue-600 hover:text-gray-100' : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700'"
            class="py-2 px-3 rounded-r-md border border-gray-200 focus:z-10">
            UDP
          </button>
        </div>
      </DisclosurePanel>
      <div v-if="!open" class="ml-5 sm:pl-16 my-1 py-2 sm:border-l-4 sm:border-blue-400"></div>
    </Disclosure>

    <Disclosure :defaultOpen="true" v-slot="{ open }">
      <DisclosureButton>
        <h1 class="flex items-center cursor-pointer">
          <div class="hidden sm:block border-4 border-blue-400 rounded-full w-10 h-10 text-lg text-center leading-8 text-blue-400">2</div>
          <div class="pl-2">
            <ChevronRightIcon
              :class="open ? 'rotate-90 transform' : ''"
              class="h-5 w-5 text-gray-400"
            />
          </div>
          <div class="pl-2 font-light text-xl">Define request</div>
        </h1>
      </DisclosureButton>
      <DisclosurePanel class="ml-5 sm:pl-16 my-1 pt-2 pb-4 sm:border-l-4 sm:border-blue-400">
        <div class="flex-col w-full">
          <div v-if="form.monitorType == 'http'">
            <div>
              <label class="text-sm text-gray-500" for="url">
                URL
              </label>
              <div class="flex">
                <div class="relative">
                  <select v-model="form.method" class="appearance-none pr-6 text-sm border bg-white pl-2 rounded-l-md py-2 cursor-pointer">
                    <option selected value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="HEAD">HEAD</option>
                    <option value="PATCH">PATCH</option>
                    <option value="PUT">PUT</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <input v-on:input="onChangeURL" id="url" v-model="form.url" @blur="v$.form.url.$touch" :class="v$.form.url.$error ? 'border-red-500 border-8' : ''" class="apperance-none cursor-pointer border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
              </div>
              <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.url.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </div>

            <div class="flex flex-col">
              <Disclosure v-slot="{ open }">
                <div class="flex">
                  <DisclosureButton>
                    <div class="my-2 ml-1 text-sm py-1 pl-1 pr-2 text-gray-500 flex items-center cursor-pointer hover:bg-gray-200 hover:rounded">
                      <ChevronRightIcon
                        :class="open ? 'rotate-90 transform' : ''"
                        class="h-4 w-4 text-gray-400" />
                      <div>Advanced settings</div>
                    </div>
                  </DisclosureButton>
                </div>
                <DisclosurePanel class="text-xs border border-gray-300 bg-white">
                  <TabGroup>
                    <TabList class="border-b border-gray-300 grid grid-cols-4">
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2">General</div>
                      </Tab>
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2 md:hidden">Request</div>
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2 hidden md:block">Request Options</div>
                      </Tab>
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2">Authentication</div>
                      </Tab>
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2">Maintenance</div>
                      </Tab>
                    </TabList>
                    <TabPanels class="p-4">
                      <TabPanel>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5">
                          <div>
                            <label class="text-label">Check frequency</label>
                            <div class="relative pr-4 mt-3">
                              <select
                                v-model="form.periodicity"
                                class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2"
                              >
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                                <option value="180">3 minutes</option>
                                <option value="300">5 minutes</option>
                                <option value="600">10 minutes</option>
                                <option value="900">15 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How often should we check your monitor?</div>
                          </div>
                          <div>
                            <label class="text-label">Recovery period</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.recoveryPeriod" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Immediate recovery</option>
                                <option value="1">1 minute</option>
                                <option value="2">2 minutes</option>
                                <option value="5">5 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How long the monitor must be up to automatically mark an incident as resolved.</div>
                          </div>
                          <div>
                            <label class="text-label">Confirmation period</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.confirmationPeriod" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Immediate start</option>
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How long to wait after observing a failure before we start a new incident.</div>
                          </div>
                          <div class="flex flex-col">
                            <label class="text-label">SSL/TLS verification</label>
                            <div class="flex items-center my-auto md:mb-0 md:mt-auto pb-2 pl-1">
                              <input v-model="form.verifySsl" id="verifySsl" name="verifySsl" type="checkbox" class="cursor-pointer h-4 w-4 text-blue-400 border-gray-300 rounded">
                              <div class="pl-1 text-caption">Should we check your security certificates?</div>
                            </div>
                          </div>
                          <div>
                            <label class="text-label">SSL expiration</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.sslCheckExpiration" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Don't check for SSL expiration</option>
                                <option value="1">Alert 1 day before</option>
                                <option value="7">Alert 7 days before</option>
                                <option value="14">Alert 14 days before</option>
                                <option value="30">Alert 1 month before</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="text-label">Domain expiration</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.domainExpiration" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Don't check for domain expiration</option>
                                <option disabled value="1">Alert 1 day before</option>
                                <option disabled value="7">Alert 7 days before</option>
                                <option disabled value="14">Alert 14 days before</option>
                                <option disabled value="30">Alert 1 month before</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <!-- Request options -->
                        <div class="flex flex-col">
                          <div class="grid grid-cols-1 md:grid-cols-3 items-center">
                            <div class="flex items-center">
                              <div class="mr-1">Timeout after</div>
                              <input v-model="form.requestTimeout" class="apperance-none cursor-pointer border rounded w-10 py-1 px-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
                              <div class="ml-1">seconds</div>
                            </div>
                            <div class="mt-2 md:mt-0 flex">
                              <input v-model="form.requestFollowRedirects" id="requestFollowRedirects" name="requestFollowRedirects" type="checkbox" class="cursor-pointer h-4 w-4 text-blue-400 border-gray-300 rounded">
                              <div class="pl-1">Follow redirects</div>
                            </div>
                            <div class="mt-2 md:mt-0 flex">
                              <input v-model="form.requestKeepCookiesRedirecting" id="requestKeepCookiesRedirecting" name="requestKeepCookiesRedirecting" type="checkbox" class="cursor-pointer h-4 w-4 text-blue-400 border-gray-300 rounded">
                              <div class="pl-1">Keep cookies when redirecting</div>
                            </div>
                          </div>
                          <div class="pt-4">
                            Request headers
                          </div>
                          <div class="flex pt-2 items-center space-x-1" v-for="(header, index) in form.requestHeaders" :key="index">
                            <input placeholder="Name" v-model="header.name" class="apperance-none cursor-pointer border rounded w-1/4 pr-4 p-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
                            <input placeholder="Value" v-model="header.value" class="apperance-none cursor-pointer border rounded w-full pr-4 py-1 px-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
                            <PlusCircleIcon :class="index == (form.requestHeaders.length - 1) ? '' : 'invisible' " @click="addHeader()" class="cursor-pointer h-5 w-5 text-gray-400"/>
                            <TrashIcon @click="removeHeader(index)" class="cursor-pointer h-5 w-5 text-gray-400"/>
                          </div>
                          <div class="pt-4">
                            Request body
                          </div>
                          <textarea v-model="form.requestBody" class="mt-2 apperance-none cursor-pointer border rounded p-2 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text" />
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <!-- Authentication -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center">
                          <div class="flex flex-col md:pr-4">
                            <label>Basic auth user</label>
                            <input v-model="form.basicAuth.user" placeholder="Username" class="mt-1 apperance-none cursor-pointer border rounded w-full py-1 px-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
                          </div>
                          <div class="flex flex-col mt-2 md:mt-0">
                            <label>Basic auth password</label>
                            <input v-model="form.basicAuth.pass" placeholder="Password" class="mt-1 apperance-none cursor-pointer border rounded w-full pr-4 py-1 px-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="password">
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div class="flex flex-col">
                          <div class="text-label text-center">Maintenance window not yet implemented</div>
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>

          <div v-if="form.monitorType == 'ping'">
            <label class="text-sm text-gray-500" for="host">
              Host
            </label>
            <input
              id="host"
              placeholder="Domain name or IPv4 address"
              v-model="form.endpoint"
              @blur="v$.form.endpoint.$touch"
              :class="v$.form.endpoint.$error ? 'border-red-500 border-8' : ''"
              class="apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              type="text"
            >
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.endpoint.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>

            <div class="flex flex-col">
              <Disclosure v-slot="{ open }">
                <div class="flex">
                  <DisclosureButton>
                    <div class="my-2 ml-1 text-sm py-1 pl-1 pr-2 text-gray-500 flex items-center cursor-pointer hover:bg-gray-200 hover:rounded">
                      <ChevronRightIcon
                        :class="open ? 'rotate-90 transform' : ''"
                        class="h-4 w-4 text-gray-400" />
                      <div>Advanced settings</div>
                    </div>
                  </DisclosureButton>
                </div>
                <DisclosurePanel class="text-xs border border-gray-300 bg-white">
                  <TabGroup>
                    <TabList class="border-b border-gray-300 grid grid-cols-2">
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2">General</div>
                      </Tab>
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2 md:hidden">Request</div>
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2 hidden md:block">Request Options</div>
                      </Tab>
                    </TabList>
                    <TabPanels class="p-4">
                      <TabPanel>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5">
                          <div>
                            <label class="text-label">Check frequency</label>
                            <div class="relative pr-4 mt-3">
                              <select
                                v-model="form.periodicity"
                                class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2"
                              >
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                                <option value="180">3 minutes</option>
                                <option value="300">5 minutes</option>
                                <option value="600">10 minutes</option>
                                <option value="900">15 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How often should we check your monitor?</div>
                          </div>
                          <div>
                            <label class="text-label">Recovery period</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.recoveryPeriod" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Immediate recovery</option>
                                <option value="1">1 minute</option>
                                <option value="2">2 minutes</option>
                                <option value="5">5 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How long the monitor must be up to automatically mark an incident as resolved.</div>
                          </div>
                          <div>
                            <label class="text-label">Confirmation period</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.confirmationPeriod" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Immediate start</option>
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How long to wait after observing a failure before we start a new incident.</div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                          <div class="grid grid-cols-1 md:grid-cols-2 items-center">
                            <div class="flex-col">
                              <div class="flex items-center">
                                <div class="mr-1">Timeout after</div>
                                <input v-model="form.requestTimeout" class="apperance-none cursor-pointer border rounded w-10 py-1 px-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
                                <div class="ml-1">seconds</div>
                              </div>
                              <div class="text-xs text-gray-500">(To be divided between the number of pings per check)</div>
                            </div>
                            <div class="mt-2 md:mt-0 flex items-center">
                              <div class="mr-1">Use</div>
                              <div class="relative">
                                <select v-model="form.numPings" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                              </div>
                              <div class="ml-1">pings per check</div>
                            </div>
                          </div>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>

          <div v-if="form.monitorType == 'tcp' || form.monitorType == 'udp'">
            <div class="grid grid-cols-2 lg:grid-cols-4">
              <div class="col-span-2 pr-1">
                <label class="text-sm text-gray-500" for="host">
                  Host
                </label>
                <input
                  id="host"
                  placeholder="Domain name or IPv4 address"
                  v-model="form.endpoint"
                  @blur="v$.form.endpoint.$touch"
                  :class="v$.form.endpoint.$error ? 'border-red-500 border-8' : ''"
                  class="apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
                  type="text"
                >
                <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.endpoint.$errors" :key="error.$uid">
                  <div>{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-span-2 mt-4 lg:pl-1 lg:mt-0">
                <label class="text-sm text-gray-500" for="port">
                  {{ form.monitorType == 'tcp' ? 'TCP' : 'UDP' }} Port
                </label>
                <input
                  id="port"
                  :placeholder="'For example ' + (form.monitorType == 'tcp' ? '80' : '162')"
                  v-model="form.port"
                  @blur="v$.form.port.$touch"
                  :class="v$.form.port.$error ? 'border-red-500 border-8' : ''"
                  class="apperance-none cursor-pointer border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
                  type="text"
                >
                <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.port.$errors" :key="error.$uid">
                  <div>{{ error.$message }}</div>
                </div>
              </div>
            </div>

            <div class="flex flex-col">
              <Disclosure v-slot="{ open }">
                <div class="flex">
                  <DisclosureButton>
                    <div class="my-2 ml-1 text-sm py-1 pl-1 pr-2 text-gray-500 flex items-center cursor-pointer hover:bg-gray-200 hover:rounded">
                      <ChevronRightIcon
                        :class="open ? 'rotate-90 transform' : ''"
                        class="h-4 w-4 text-gray-400" />
                      <div>Advanced settings</div>
                    </div>
                  </DisclosureButton>
                </div>
                <DisclosurePanel class="text-xs border border-gray-300 bg-white">
                  <TabGroup>
                    <TabList class="border-b border-gray-300 grid grid-cols-2">
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2">General</div>
                      </Tab>
                      <Tab v-slot="{ selected }" class="hover:bg-gray-200">
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2 md:hidden">Request</div>
                        <div :class="selected ? 'border-blue-400 border-b-2' : 'hover:border-gray-500 border-b-1'" class="py-2 lg:px-2 hidden md:block">Request Options</div>
                      </Tab>
                    </TabList>
                    <TabPanels class="p-4">
                      <TabPanel>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5">
                          <div>
                            <label class="text-label">Check frequency</label>
                            <div class="relative pr-4 mt-3">
                              <select
                                v-model="form.periodicity"
                                class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2"
                              >
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                                <option value="180">3 minutes</option>
                                <option value="300">5 minutes</option>
                                <option value="600">10 minutes</option>
                                <option value="900">15 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How often should we check your monitor?</div>
                          </div>
                          <div>
                            <label class="text-label">Recovery period</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.recoveryPeriod" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Immediate recovery</option>
                                <option value="1">1 minute</option>
                                <option value="2">2 minutes</option>
                                <option value="5">5 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How long the monitor must be up to automatically mark an incident as resolved.</div>
                          </div>
                          <div>
                            <label class="text-label">Confirmation period</label>
                            <div class="relative pr-4 mt-3">
                              <select v-model="form.confirmationPeriod" class="appearance-none w-full cursor-pointer pr-6 border bg-white pl-2 rounded py-2">
                                <option value="0">Immediate start</option>
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                            <div class="mt-2 text-caption">How long to wait after observing a failure before we start a new incident.</div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                          <div class="flex flex-col">
                            <div class="flex items-center">
                              <div class="mr-1">Timeout after</div>
                              <input v-model="form.requestTimeout" class="apperance-none cursor-pointer border rounded w-10 py-1 px-1 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text">
                              <div class="ml-1">seconds</div>
                            </div>

                          <div class="pt-4">
                            Send data
                          </div>
                          <input
                            id="port"
                            v-model="form.data"
                            :placeholder="form.monitorType == 'tcp' ? 'GET / HTTP/1.1\\r\\n' : ''"
                            class="apperance-none cursor-pointer border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
                            type="text"
                          >
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </DisclosurePanel>
              </Disclosure>
            </div>

          </div>


          <div class="mt-4">
            <label class="text-sm text-gray-500" for="name">
            Name
            </label>
            <input
              id="name"
              placeholder="Give your monitor a name"
              v-model="form.name"
              @blur="v$.form.name.$touch"
              :class="v$.form.name.$error ? 'border-red-500 border-8' : ''"
              class="apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              type="text"
            >
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.name.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </div>
        </div>
      </DisclosurePanel>
      <div v-if="!open" class="ml-5 sm:pl-16 my-1 py-2 sm:border-l-4 sm:border-blue-400"></div>
    </Disclosure>

    <Disclosure :defaultOpen="true" v-slot="{ open }">
      <DisclosureButton>
        <h1 class="flex items-center cursor-pointer">
          <div class="hidden sm:block border-4 border-blue-400 rounded-full w-10 h-10 text-lg text-center leading-8 text-blue-400">3</div>
          <div class="pl-2">
            <ChevronRightIcon
              :class="open ? 'rotate-90 transform' : ''"
              class="h-5 w-5 text-gray-400"
            />
          </div>
          <div class="pl-2 font-light text-xl">Define alert</div>
        </h1>
      </DisclosureButton>
      <DisclosurePanel class="ml-5 sm:pl-16 my-1 pt-2 pb-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="">
            <div class="text-sm text-gray-500">Create an incident when the {{ form.monitorType == 'http' ? 'URL' : 'host' }}</div>
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-1 text-gray-700 text-sm">
              <div class="relative grid-cols-1">
                <select v-model="form.alertType" class="w-full appearance-none cursor-pointer border bg-white p-2 rounded">
                  <option value="unavailable">Becomes unavailable</option>
                  <option v-if="form.monitorType != 'ping'" value="does_not_contain_keyword">Doesn't contain keyword</option>
                  <option v-if="form.monitorType == 'http'" value="contains_keyword">Contains keyword</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center p-2">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <input v-if="form.alertType != 'unavailable'" placeholder="Keyword" v-model="form.keyword" class="col-span-1 apperance-none cursor-pointer border rounded p-2 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500" type="text" />
            </div>
          </div>
          <div class="">
            <div class="text-sm text-gray-500">When there's an incident</div>
            <div class="flex mt-2">
              <div class="flex items-center">
                <input disabled type="checkbox" class="cursor-pointer h-4 w-4 text-blue-400 border-gray-300 rounded">
                <div class="pl-2 text-xs text-gray-500">Call</div>
              </div>
              <div class="flex items-center ml-6">
                <input disabled type="checkbox" class="cursor-pointer h-4 w-4 text-blue-400 border-gray-300 rounded">
                <div class="pl-2 text-xs text-gray-500">Send sms</div>
              </div>
              <div class="flex items-center ml-6">
                <input v-model="form.alertSendEmail" type="checkbox" class="cursor-pointer h-4 w-4 text-blue-400 border-gray-300 rounded">
                <div class="pl-2 text-xs">Send email</div>
              </div>
            </div>
            <div class="mt-3 text-caption text-gray-600">to the monitor owner</div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <div class="flex justify-end mt-8 mb-3">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
        {{ editing ? 'Save' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<script>
import { ChevronRightIcon, PlusCircleIcon, TrashIcon } from '@heroicons/vue/24/outline'
import {
  Disclosure, DisclosureButton, DisclosurePanel,
  TabGroup, TabList, Tab, TabPanels, TabPanel,
} from '@headlessui/vue'

import useVuelidate from "@vuelidate/core"
import { integer, ipAddress, required, requiredIf, url, helpers, or } from '@vuelidate/validators'

import { defaultMonitorForm } from '@/components/forms/default.js'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  props: {
    editing: { type: Boolean, required: false },
    initialForm: { type: Object }
  },
  data() {
    return {
      form: defaultMonitorForm,
    }
  },
  validations() {
    const isHttp = value => this.form.monitorType == 'http'
    const notHttp = value => this.form.monitorType != 'http'
    // TODO validate all requests headers names are different?
    // TODO validate that if basic auth is setted, no authentication header exists, to avoid overwritting it
    return {
      form: {
        url: {
          shouldBeUrl: helpers.withMessage('The value is not a valid URL address', or(notHttp, url)),
          requiredWhenHttp: requiredIf(isHttp),
        },
        endpoint: {
          shouldBeIp: helpers.withMessage('The value is not a valid IP4 address', or(isHttp, ipAddress)),
          requiredWhenNotHttp: requiredIf(notHttp),
        },
        port: {
          integer,
          requiredWhen: requiredIf(() => this.form.monitorType == 'tcp' || this.form.monitorType == 'udp'),
        },
        name: {
          required: helpers.withMessage('This field cannot be empty', required),
        },
      }
    }
  },
  components: {
    Disclosure, DisclosureButton, DisclosurePanel,
    ChevronRightIcon, PlusCircleIcon, TrashIcon,
    TabGroup, TabList, Tab, TabPanels, TabPanel,
  },
  methods: {
    async onSubmit() {
      const result = await this.v$.$validate()
      if (!result) {
        // notify user form is invalid
        return
      }
      this.$emit('submit')
    },
    onChangeURL() {
      if (this.form.name == '' || this.form.name == this.normalizedUrl.slice(0, -1)) {
        this.form.name = this.normalizedUrl
      }
    },
    removeHeader(index) {
      this.form.requestHeaders.splice(index, 1)
    },
    addHeader() {
      this.form.requestHeaders.push({name: '', value: ''})
    },
    notImplementedAlert() {
      alert('Not implemented')
    },
  },
  computed: {
    normalizedUrl() {
      let modifiedUrl = this.form.url
      if (modifiedUrl.startsWith('https://')) {
        modifiedUrl = modifiedUrl.replace('https://', '')
      }
      if (modifiedUrl.startsWith('http://')) {
        modifiedUrl = modifiedUrl.replace('http://', '')
      }
      if (modifiedUrl.startsWith('w')) {
        modifiedUrl = modifiedUrl.replace('w', '')
        if (modifiedUrl.startsWith('w')) {
          modifiedUrl = modifiedUrl.replace('w', '')
          if (modifiedUrl.startsWith('w')) {
            modifiedUrl = modifiedUrl.replace('w', '')
            if (modifiedUrl.startsWith('.')) {
              modifiedUrl = modifiedUrl.replace('.', '')
            }
          }
        }
      }
      return modifiedUrl
    },
  },
  watch: {
    initialForm: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.form = newValue
      }
    }
  },
  emits: ['submit'],
}
</script>

<style scoped>
.text-label {
  font-weight: 500;
  /* color: rgb(34 40 56); */
}

.text-caption {
  font-size: 12px;
  line-height: 133%;
}
</style>