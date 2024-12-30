<template>
  <table>
    <slot />
  </table>
</template>
<script>
export default {}
</script>

<style lang="scss" scoped>
table {
  border: 1px solid rgba(211, 211, 211, 1);
  border-collapse: separate;
  border-left: 0;
  border-radius: 5px;
  border-spacing: 0px;
  width: 100%;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
  border-collapse: separate;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
th,
td {
  text-align: left;
  vertical-align: center;
  border-left: 1px solid rgba(211, 211, 211, 1);
}
td {
  border-top: 1px solid rgba(211, 211, 211, 1);
  input,
  select,a {
    border: 1px solid transparent;
    color: rgba(0, 0, 0, 1);
    font-family: Rubik;
    font-style: normal;
    font-weight: 300;
    font-size: 0.95rem;
    line-height: 18px;
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: var(--secondary);
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: var(--secondary);
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: var(--secondary);
  }
}
th {
  border-top: 1px solid rgba(211, 211, 211, 1);
  padding: 0.5rem 1rem;
  width: 200px;
}
tr:nth-of-type(1) {
  th,
  td {
    border-top: none;
    vertical-align: middle;
  }
}
thead:first-child tr:first-child th:first-child,
tbody:first-child tr:first-child td:first-child {
  border-radius: 4px 0 0 0;
}
thead:last-child tr:last-child th:first-child,
tbody:last-child tr:last-child td:first-child {
  border-radius: 0 0 0 4px;
}
</style>
