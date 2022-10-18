<Icon name={_iconName}/>

<script lang="ts">
import { Icon } from '../index'
import iconNames from '../icon/names.json'

$: _iconName = iconNames[ Math.floor(Math.random() * iconNames.length) ]
</script>
