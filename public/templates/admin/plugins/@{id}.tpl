<ul class="nav nav-pills">
	<li class="active"><a href="#settings" data-toggle="tab" aria-expanded="false">[[@{iD}:tabs.settings]]</a></li>
	<li><a href="#sets" data-toggle="tab" aria-expanded="true">[[@{iD}:tabs.sets]]</a></li>
	<li><a href="#download" data-toggle="tab" aria-expanded="true">[[@{iD}:tabs.download]]</a></li>
</ul>

<div class="tab-content">
  <div class="tab-pane fade active in" id="settings">
    <form class="form-horizontal" id="@{id}-settings">
      <div class="panel panel-default">
        <h2 class="panel-heading">[[@{iD}:name]] <small>[[@{iD}:version]]</small> / [[@{iD}:settings]]</h2>

        <div class="panel-body">
          <div class="form-group">
            <label for="@{id}-completion" class="col-xs-12 col-sm-6 control-label checkbox-label">
              [[@{iD}:settings.completion.enable]]
            </label>
            <div class="col-xs-12 col-sm-6">
              <input id="@{id}-completion" class="form-checkbox" type="checkbox" data-key="completion.enabled"
                     data-trim="false"/>
            </div>
          </div>

          <div class="form-group hidden completion-group">
            <label for="@{id}-min-chars" class="col-xs-12 col-sm-6 control-label">
              [[@{iD}:settings.completion.chars]]
            </label>
            <div class="col-xs-12 col-sm-6">
              <input id="@{id}-min-chars" class="form-control" type="number" data-key="completion.minChars"/>
            </div>
          </div>

          <div class="form-group hidden completion-group">
            <label for="@{id}-max-lines" class="col-xs-12 col-sm-6 control-label">
              [[@{iD}:settings.completion.lines]]
            </label>
            <div class="col-xs-12 col-sm-6">
              <input id="@{id}-max-lines" class="form-control" type="number" data-key="completion.maxLines"/>
            </div>
          </div>

          <div class="form-group hidden completion-group">
            <label for="@{id}-regex" class="col-xs-12 col-sm-6 control-label">
              [[@{iD}:settings.completion.regex]]
            </label>
            <div class="col-xs-12 col-sm-6">
              <div class="input-group input-group-sm">
                <div class="input-group-addon"><code class="text-right">/^[\s\S]*(</code></div>
                <input id="@{id}-regex" class="form-control text-mono" type="text" data-key="completion.prefix"/>
                <div class="input-group-addon"><code>):/i</code></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <div class="row">
            <div class="col-xs-12 col-md-4">
              <button type="submit" class="btn btn-primary btn-block" id="@{id}-settings-save" accesskey="s">
                <i class="fa fa-fw fa-save"></i> [[plugins:actions.save.plain]]
              </button>
            </div>
            <div class="col-xs-12 col-md-4">
              <button type="button" class="btn btn-warning btn-block" id="@{id}-settings-reset">
                <i class="fa fa-fw fa-eraser"></i> [[plugins:actions.reset]]
              </button>
            </div>
            <div class="col-xs-12 col-md-4">
              <button type="button" class="btn btn-danger btn-block" id="@{id}-settings-purge">
                <i class="fa fa-fw fa-history"></i> [[plugins:actions.purge]]
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div class="tab-pane fade" id="sets">
    <div id="active-sets-section" class="hidden">
      <h3>[[@{iD}:sets.active]]</h3>

      <div id="active-sets-container" class="sets-container"></div>

      <hr/>
    </div>

    <div class="hidden">
      <div id="active-set-template">
        <div class="set-container active-set-container"><!-- insert id as data-set-id -->
          <div class="panel panel-default">
            <h3 class="panel-heading"><!-- insert heading --></h3>

            <div class="panel-body">
              <div class="row">
                <div class="col-xs-12 description-container"><!-- add class col-sm-7 if preview exists -->
                  <div class="well well-sm no-margin-bottom description"><!-- remove class no-margin-bottom if preview exist -->
                    <!-- insert description -->
                  </div>
                </div>
                <div class="col-xs-12 col-sm-5 preview-container"><!-- remove if no preview exists -->
                  <div class="preview-block center-block">
                    <img class="img-responsive thumbnail center-block no-margin-bottom"/><!-- insert preview as src -->
                  </div>
                </div>
              </div>
            </div>

            <!-- TODO add set-specific options: mapping, excludes -->

            <div class="panel-footer">
              <div class="row">
                <div class="col-xs-12 col-sm-6 deactivate-container">
                  <a class="set-action set-deactivate btn btn-block btn-sm btn-warning" disabled>
                    <i class="fa fa-fw fa-power-off"></i> [[@{iD}:set.deactivate]]
                  </a>
                </div>
                <div class="col-xs-12 col-sm-6 update-container"><!-- remove if static -->
                  <a class="set-action set-update btn btn-block btn-sm btn-info" disabled>
                    <i class="fa fa-fw fa-refresh"></i> [[@{iD}:set.update]]
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3>[[@{iD}:sets.inactive]]</h3>

    <div id="available-sets-container" class="sets-container">
      <!-- BEGIN sets.installed -->
        <div class="panel panel-default set-container available-set-container<!-- IF sets.installed.active --> hidden<!-- ENDIF sets.installed.active -->"
             data-set-id="{sets.installed.id}">
          <h3 class="panel-heading">{sets.installed.name} <small>{sets.installed.module}</small></h3>

          <div class="panel-body">
            <div class="row">
              <div class="col-xs-12<!-- IF sets.installed.preview --> col-sm-7<!-- ENDIF sets.installed.preview -->">
                <div class="well well-sm<!-- IF !sets.installed.preview --> no-margin-bottom<!-- ENDIF !sets.installed.preview -->">
                  {sets.installed.description}
                </div>
              </div>
              <!-- IF sets.installed.preview -->
                <div class="col-xs-12 col-sm-5">
                  <div class="preview-block center-block">
                    <img class="img-responsive thumbnail center-block no-margin-bottom" src="{sets.installed.preview}"/>
                  </div>
                </div>
              <!-- ENDIF sets.installed.preview -->
            </div>
          </div>

          <div class="panel-footer">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-lg-3">
                <a class="set-action set-activate btn btn-block btn-sm btn-success" disabled>
                  <i class="fa fa-fw fa-power-off"></i> [[@{iD}:set.activate]]
                </a>
              </div>
              <!-- IF !sets.installed.static -->
                <div class="col-xs-12 hidden-sm hidden-md col-lg-3">
                  <a class="set-action set-update btn btn-block btn-sm btn-info" disabled>
                    <i class="fa fa-fw fa-refresh"></i> [[@{iD}:set.update]]
                  </a>
                </div>
                <div class="col-xs-12 col-sm-6 col-lg-3">
                  <a class="set-action set-purge btn btn-block btn-sm btn-warning" disabled>
                    <i class="fa fa-fw fa-eraser"></i> [[@{iD}:set.purge]]
                  </a>
                </div>
                <div class="col-sm-6 hidden-xs hidden-lg">
                  <a class="set-action set-update btn btn-block btn-sm btn-info" disabled>
                    <i class="fa fa-fw fa-refresh"></i> [[@{iD}:set.update]]
                  </a>
                </div>
              <!-- ENDIF !sets.installed.static -->
              <div class="col-xs-12 col-sm-6 col-lg-3<!-- IF sets.installed.static --> col-lg-offset-6<!-- ENDIF sets.installed.static -->">
                <a class="set-action set-uninstall btn btn-block btn-sm btn-danger" disabled
                   title="This feature is not yet implemented. Sorry!">
                  <i class="fa fa-fw fa-trash-o"></i> [[@{iD}:set.uninstall]]
                </a>
              </div>
            </div>
          </div>
        </div>
      <!-- END sets.installed -->
    </div>
  </div>

  <div class="tab-pane fade" id="download">
    <div id="install-sets-container" class="sets-container">
      <!-- BEGIN sets.notInstalled -->
        <!-- TODO do not show sets that ain't compatible with current NodeBB version as of NBBPM -->
        <div class="panel panel-default set-container install-set-container" data-set-id="{sets.notInstalled.id}">
          <h3 class="panel-heading">{sets.notInstalled.name} <small>{sets.notInstalled.module}</small></h3>

          <div class="panel-body">
            <div class="row">
              <div class="col-xs-12<!-- IF sets.notInstalled.preview --> col-sm-7<!-- ENDIF sets.notInstalled.preview -->">
                <div class="well well-sm<!-- IF !sets.notInstalled.preview --> no-margin-bottom<!-- ENDIF !sets.notInstalled.preview -->">
                  {sets.notInstalled.description}
                </div>
              </div>
              <!-- IF sets.notInstalled.preview -->
                <div class="col-xs-12 col-sm-5">
                  <div class="preview-block center-block">
                    <img class="img-responsive thumbnail center-block no-margin-bottom"
                         src="{sets.notInstalled.preview}"/>
                  </div>
                </div>
              <!-- ENDIF sets.notInstalled.preview -->
            </div>
          </div>

          <div class="panel-footer">
            <!-- TODO add functionality to action -->
            <a class="set-action set-install btn btn-block btn-sm btn-default" disabled
               title="This feature is not yet implemented. Sorry!">
              <i class="fa fa-fw fa-download"></i> [[@{iD}:set.install]]
            </a>
          </div>
        </div>
      <!-- END sets.notInstalled -->
    </div>
  </div>
</div>

<link rel="stylesheet" type="text/css" href="{relative_path}/plugins/@{name}/styles/admin/settings.css"/>


<script type="text/javascript" src="{relative_path}/plugins/@{name}/scripts/debug.js"></script>

<script type="text/javascript" src="{relative_path}/plugins/@{name}/scripts/admin/settings.js"></script>

<script type="text/javascript" src="{relative_path}/plugins/@{name}/scripts/admin/sets/actions.js"></script>
<script type="text/javascript" src="{relative_path}/plugins/@{name}/scripts/admin/sets/data.js"></script>
<script type="text/javascript" src="{relative_path}/plugins/@{name}/scripts/admin/sets/dom.js"></script>
<script type="text/javascript" src="{relative_path}/plugins/@{name}/scripts/admin/sets/main.js"></script>
