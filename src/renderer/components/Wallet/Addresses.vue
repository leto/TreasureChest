<template>
  <div>
      {{$t('message.intro_adresses_1')}}<br />
      <span>
</span>
    <div class="container" >
      <el-row class="caption">
<el-col :span="10">
<el-button round type=warning id="import-address" v-on:click="importZaddrDialog()">{{$t('message.import_zaddr')}}<icon name=angle-double-down></icon></el-button>
<el-button round type=success id="generate-address" v-on:click="addZAddress()">{{$t('message.new_zaddr')}}<icon name=plus></icon></el-button>
</el-col>
      </el-row>
      <el-table :data="zAddresses" height="200" style="width: 100%" empty-text="None"  @row-click="copyToClipboard">
        <el-table-column prop="balance" v-bind:label="$t('message.amount')" width="140" nowrap> </el-table-column>
        <el-table-column prop="addressView" v-bind:label="$t('message.shielded_zaddr')" width="*" class-name="zaddress"> </el-table-column>        
      </el-table>        
    </div>
    <div class="container" >
      <el-row class="caption">
        <el-col :span="10" >
<el-button round type=warning class="import-address" v-on:click="importTaddrDialog()">{{$t('message.import_taddr')}}<icon name=angle-double-down></icon></el-button>
<el-button round type=success class="generate-address" v-on:click="addTAddress()">{{$t('message.new_taddr')}}<icon name=plus></icon></el-button>

</el-col>
      </el-row>   
      <el-table :data="tAddresses" height="200" style="width: 100%" empty-text="None" @row-click="copyToClipboard">
        <el-table-column prop="balance" v-bind:label="$t('message.amount')" width="140" nowrap> </el-table-column>
        <el-table-column  prop="addressView" v-bind:label="$t('message.transparent_taddr')" width="*" class-name="taddress" > </el-table-column>      
        <icon name=copy></icon>
        </el-table>

    </div>
<div>
<ul>
<li>
{{$t('message.intro_adresses_2')}}
{{$t('message.intro_adresses_3')}}
{{$t('message.intro_adresses_4')}}
{{$t('message.intro_adresses_5')}}
</li>
<li>
{{$t('message.intro_adresses_6')}}
{{$t('message.intro_adresses_7')}}
{{$t('message.intro_adresses_8')}}
</li>
</ul>
    <span>
    <a class="button" id="funding" v-on:click="fundHushFund()">{{$t('message.fund_hush_fund')}}</a>
</span>

</div>
    <div class="bottom-row">
      <div class="box alt">
        <ul id="texts">
          <li><icon class=fa-fw name=eye></icon>{{$t('message.transparent')}}:</li>
          <li><icon class=fa-fw name=shield-alt></icon>{{$t('message.shielded')}}:</li>
          <li><icon class=fa-fw name=balance-scale></icon>{{$t('message.total')}}:</li>
        </ul>
        <ul id="balances">
          <li v-bind:class="{ unconfirmed: !tBalance.valid }" > {{ tBalance.balance }} ARRR</li>
          <li v-bind:class="{ unconfirmed: !zBalance.valid }" > {{ zBalance.balance }} ARRR</li>
          <li v-bind:class="{ unconfirmed: !totalBalance.valid }"> {{ totalBalance.balance }} ARRR</li>
        </ul>
      </div>
        <div class="box alt">
            <b>{{$t('message.network_stats')}}</b><br/>
            <icon name=download></icon>{{ totalBytesRecv }} {{$t('message.bytes_received')}}<br/>
            <icon name=upload></icon>{{ totalBytesSent }} {{$t('message.bytes_sent')}}<br/>
        </div>
        <div class="box alt">
            <icon name="brands/btc"></icon> {{ priceBTC }} BTC/ARRR<br/>
            <icon name="euro-sign"></icon> {{ priceKMD }} KMD/ARRR<br/>
            <icon name="euro-sign"></icon> {{ priceEUR }} EUR/ARRR<br/>
            <icon name="dollar-sign"></icon> {{ priceUSD }} USD/ARRR<br/>
        </div>
      </div>

    <el-dialog v-bind:title="$t('message.import_transparent_address')" :visible.sync="importTaddrVisible" width="60%" >
      <el-form :model="importTaddrForm">
        <el-form-item v-bind:label="$t('message.private_key_wif')" label-width="100px">
          <el-input placeholder={{$t('message.wallet_import_format_taddr')}} v-model="importTaddrForm.wif" auto-complete="off"></el-input>
        </el-form-item>
        <div>
            <ul>
            <li><icon name=key></icon> {{$t('message.never_give_private_key')}}</li>
            <li><icon name=user-secret></icon> {{$t('message.treat_it_like_a_password')}}</li>
            <li><icon name=share-alt></icon> {{$t('message.import_a_private_key')}}</li>
            </ul>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importTaddrVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="importTaddress(importTaddrForm.wif,true)">{{$t('message.import')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog v-bind:title="$t('message.import_shielded_address')" :visible.sync="importZaddrVisible" width="60%" >
      <el-form :model="importZaddrForm">
        <el-form-item v-bind:label="$t('message.private_key_wif')" label-width="100px">
          <el-input v-bind:placeholder="$t('message.wallet_import_format_zaddr')" v-model="importZaddrForm.wif" auto-complete="off"></el-input>
        </el-form-item>
        <div>
            <ul>
            <li><icon name=key></icon> {{$t('message.never_give_private_key')}}</li>
            <li><icon name=user-secret></icon> {{$t('message.treat_it_like_a_password')}}</li>
            <li><icon name=share-alt></icon> {{$t('message.import_a_private_key')}}</li>
            </ul>
        </div>
<!--
        <el-form-item label="Start Height" label-width="100px">
          <el-input v-model="importZaddrForm.startHeight" value=0 auto-complete="off"></el-input>
        </el-form-item>
-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importZaddrVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="importZaddress(importZaddrForm)">{{$t('message.import')}}</el-button>
      </span>
    </el-dialog>

    </div>
</template>

<script>
  import { mapState,mapGetters, mapActions } from 'vuex'
  import copy from 'copy-to-clipboard';
  import Vue from 'vue'
  import Vuex from 'vuex'
  import VueI18n from 'vue-i18n'
  import messages from '../../../lang/messages'
  var store = require('store')

  Vue.use(Vuex)
  Vue.use(VueI18n)

  // Create VueI18n instance with options
  //let localisation = navigator.language
  let localisation = navigator.language.split("-")[0] // Use browser first language
  const i18n = new VueI18n({
    fallbackLocale: 'en',
    locale: localisation,
    //dateTimeFormats,
    //numberFormats
    messages
  })

  let vue = new Vue({ i18n })

  export default { 
    name: 'addresses',
    components: {  },
    data() {
      return {
        polling :false,
        hoverAddress: null,
        importTaddrVisible: false,
        importTaddrForm: {
            wif: "",
            rescan: true,
        },
        importZaddrVisible: false,
        importZaddrForm: {
            wif: "",
            rescan: "whenkeyisnew",
            startHeight: 0,
        },
      }
    },

    computed:{
      ...mapState([
        'tBalance',
        'zBalance',
        'totalBalance',
        'totalBytesRecv',
        'totalBytesSent',
        'priceBTC',
        'priceKMD',
        'priceUSD',
        'priceEUR',
      ]),
      ...mapGetters([
        'zAddresses',
        'tAddresses',
        'lastUpdate',
      ])
    },

    methods: {
      mouseover (address) {
        this.$data.hoverAddress = address;
      },
      ...mapActions([
        'addTAddress',
        'addZAddress',
        'importTaddr',
        'importZaddr',
      ]),
      copyToClipboard (row) {        
        copy(row.address)
        //alert('Copied ' + row.address + ' to clipboard.')
        alert(i18n.t('message.copied_to_clipboard', { value: row.address }))
      },     
      importTaddrDialog() {
          this.importTaddrVisible = true;
      },
      importZaddrDialog() {
          this.importZaddrVisible = true;
      },
      importTaddress(wif,rescan) {
        rescan = rescan ? true : false;
        this.$store.dispatch('importTaddr', wif, rescan);
      },
      importZaddress(form) {
        var wif         = form.wif;
        var rescan      = form.rescan;
        var startHeight = form.startHeight;
        this.$store.dispatch('importZaddr', wif, rescan, startHeight);
      },
    },

    mounted: function() {     
    }
  }
</script>

<style>

 .container {    
    width: 100%;
    margin-top: 10px;
    padding: 15px 25px 15px 30px;
    background-color: #eaeaea;
    border-radius: 11px;
  }
  
  .caption {
    font-weight: 700;
    font-size: 12pt
  }
  
  .caption .balance {
    font-weight: 400;
  }

  .caption span {
    font-weight: 400;
    color: #2f77f7;
  }

  .intro {
    font-weight: 400;
    font-size: 10pt
  }
  .copy {    
    font-weight: 400;
    font-size: 11pt;
    color: #5e5e5e;
  }

  .button {
    font-size: 12pt;
    cursor: pointer;
    outline: none;
    padding: 5px 15px 5px 15px;
    border-radius: 4px;
    display: inline-block;
    color: #fff;
    background-color: #2F77F7;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #2F77F7;
    text-decoration: none;
    -webkit-app-region: no-drag;
  }

  .button:hover {
    background-color: #2262d6;
  }

  .button-alt {
    color: #3e3e3e;
    margin-right: 5px;
    background-color: transparent;
  }

  .button-alt:hover {
    background-color: #e2e2e2;
  }

  .white {
    color: white !important;
    text-color: white !important;
  }

  .unconfirmed {
    color: red !important;
  }

</style>
