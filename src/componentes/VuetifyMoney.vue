<template>
  <div>
    <v-text-field
      v-model="cmpValue"
      v-bind:label="label"
      v-bind:placeholder="placeholder"
      v-bind:readonly="readonly"
      v-bind:disabled="disabled"
      v-bind:outlined="outlined"
      v-bind:dense="dense"
      v-bind:hide-details="hideDetails"
      v-bind:error="error"
      v-bind:error-messages="errorMessages"
      v-bind:rules="rules"
      v-bind:clearable="clearable"
      v-bind:backgroundColor="backgroundColor"
      v-bind:prefix="options.prefix"
      v-bind:suffix="options.suffix"
      v-bind="properties"
      v-on:keypress="keyPress"
      v-on:blur="onBlur"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  /* eslint-disable */

  model: { prop: 'value', event: 'input' },
  props: {
    value: {
      // type: String,
      type: [String, Number],
      default: '0'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: undefined
    },
    readonly: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: [Boolean, String],
      default: false
    },
    errorMessages: {
      type: [Array, String],
      default: () => []
    },
    rules: {
      type: [Array, String],
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'white'
    },
    valueWhenIsEmpty: {
      type: String,
      default: '' // '0' or '' or null
    },
    valueOptions: {
      type: Object,
      default: function () {
        return {
          min: 0,
          minEvent: 'SetValueMin'
        };
      }
    },
    options: {
      type: Object,
      default: function () {
        return {
          locale: 'pt-BR',
          prefix: '',
          suffix: '',
          length: 11,
          precision: 2
        }
      }
    },
    // Other v-text-field properties
    properties: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
  }),
  /*
    the-vue-mask no funciona correctamente cuando se incluyen valores existentes en el componente principal.
  */
  computed: {
    cmpValue: {
      get: function () {
        return this.value !== null && this.value !== ''
          ? this.humanFormat(this.value.toString())
          : this.valueWhenIsEmpty
      },
      set: function (newValue) {
        this.$emit('input', this.machineFormat(newValue))
      }
    }
  },
  methods: {
    humanFormat: function (number) {
      if (isNaN(number)) {
        number = ''
      } else {
        // número = Número(número).toLocaleString(this.options.locale, {maximumFractionDigits: 2, minimoFractionDigits: 2, estilo: 'moneda', moneda: 'BRL'});
        number = Number(number).toLocaleString(this.options.locale, {
          maximumFractionDigits: this.options.precision,
          minimumFractionDigits: this.options.precision
        })
      }
      return number
    },
    machineFormat (number) {
      if (number) {
        number = this.cleanNumber(number)
        // Ajustar el número de ceros a la izquierda
        number = number.padStart(parseInt(this.options.precision) + 1, '0')
        // Incluir punto en el espacio correcto, según la precisión configurada
        number =
          number.substring(
            0,
            number.length - parseInt(this.options.precision)
          ) +
          '.' +
          number.substring(
            number.length - parseInt(this.options.precision),
            number.length
          )
        if (isNaN(number)) {
          number = this.valueWhenIsEmpty
        }
      } else {
        number = this.valueWhenIsEmpty
      }
      if (this.options.precision === 0) {
        number = this.cleanNumber(number)
      }
      return number
    },
    keyPress ($event) {
      // console.log($event.keyCode);
      // valor de códigos clave
      const keyCode = $event.keyCode ? $event.keyCode : $event.which
      // if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault()
      }
      if (this.targetLength()) {
        $event.preventDefault()
      }
    },
    // Retira todos los caracteres no numéricos y zeros a la izquierda
    cleanNumber: function (value) {
      let result = ''
      if (value) {
        let flag = false
        const arrayValue = value.toString().split('')
        for (let i = 0; i < arrayValue.length; i++) {
          if (this.isInteger(arrayValue[i])) {
            if (!flag) {
              // Retirar zeros a la izquierda
              if (arrayValue[i] !== '0') {
                result = result + arrayValue[i]
                flag = true
              }
            } else {
              result = result + arrayValue[i]
            }
          }
        }
      }
      return result
    },
    isInteger (value) {
      let result = false
      if (Number.isInteger(parseInt(value))) {
        result = true
      }
      return result
    },
    targetLength () {
      console.log("validacion = " + Number(this.cleanNumber(this.value).length) >=
        Number(this.options.length) + 'Valor 1 = ' + Number(this.cleanNumber(this.value).length) + ' valor 2: ' +Number(this.options.length));
      if (
        Number(this.cleanNumber(this.value).length) >=
        Number(this.options.length)
      ) {
        return true
      } else {
        return false
      }
    },
    onBlur () {
      var lastDigit = this.cmpValue.toString().slice(-1)
      var aux = parseInt(this.cmpValue.replace(',', '')) - parseInt(lastDigit)
      this.cmpValue = aux
      this.$emit('keyUpNumberTotal', aux)
      if (
        this.value != null && this.value.length === 0 ||
        parseFloat(this.value) <= this.valueOptions.min
      )
        this.$emit(
          this.valueOptions.minEvent || 'SetValueMin',
          this.valueOptions.min
        )

      if (
        this.valueOptions.max &&
        parseFloat(this.value) >= this.valueOptions.max
      )
        this.$emit(
          this.valueOptions.maxEvent || 'SetValueMax',
          this.valueOptions.max
        )
    }
  }
}
</script>
