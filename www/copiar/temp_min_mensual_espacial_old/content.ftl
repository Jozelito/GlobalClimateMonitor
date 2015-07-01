<#--
Body section of the GetFeatureInfo template, it's provided with one feature collection, and
will be called multiple times if there are various feature collections
-->
<div class="feature_info">
	<a class="close_fancy" href="#"><img src="img/GCV_icon_cerrar.svg" alt="Close"/></a>
	<h5>Monthly Global Average Minimum Temperature</h5>

 <table>
   	<tr>
                <th>Date</th>
                <th>Value</th>
	</tr>
 	<#list features as feature>
 		<tr>
      			<td>${feature.mes.value}/${feature.agno.value}</td>
      			<td>${feature.temp_min.value} &#176;C.</td>
		</tr>
	</#list>
</table>	 
</div>
